/* =====================================================================
   LOOT MARKET — state (cart, wishlist, orders, recently viewed)
   Everything is persisted in localStorage so it survives reloads.
   ===================================================================== */

const LM = (() => {
  const KEYS = { cart: "lm_cart", wish: "lm_wish", orders: "lm_orders", recent: "lm_recent", saved: "lm_saved", coupon: "lm_coupon", pin: "lm_pin", addr: "lm_addr" };

  const read = (k, fallback) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  };
  const write = (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ }
    document.dispatchEvent(new CustomEvent("lm:change", { detail: k }));
  };

  /* ---------- helpers ---------- */
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const pct = (price, mrp) => (mrp > price ? Math.round((1 - price / mrp) * 100) : 0);
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || id;
  const param = (k) => new URLSearchParams(location.search).get(k);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* unit price for a specific variant */
  const unitPrice = (p, optIdx = 0) => p.price + ((p.options && p.options.add[optIdx]) || 0);
  const unitMrp = (p, optIdx = 0) => p.mrp + ((p.options && p.options.add[optIdx]) || 0);

  /* ---------- cart ---------- */
  const lineKey = (id, color, opt) => `${id}|${color ?? ""}|${opt ?? ""}`;
  const cart = {
    all: () => read(KEYS.cart, []),
    count: () => cart.all().reduce((s, l) => s + l.qty, 0),
    add(id, qty = 1, color = null, opt = null) {
      const items = cart.all();
      const key = lineKey(id, color, opt);
      const p = byId(id);
      const found = items.find((l) => l.key === key);
      if (found) found.qty = Math.min(found.qty + qty, Math.min(p.stock, 10));
      else items.push({ key, id, qty: Math.min(qty, p.stock, 10), color, opt });
      write(KEYS.cart, items);
    },
    setQty(key, qty) {
      const items = cart.all();
      const l = items.find((x) => x.key === key);
      if (!l) return;
      l.qty = Math.max(1, Math.min(qty, 10, byId(l.id).stock));
      write(KEYS.cart, items);
    },
    remove(key) { write(KEYS.cart, cart.all().filter((l) => l.key !== key)); },
    clear() { write(KEYS.cart, []); localStorage.removeItem(KEYS.coupon); },
    /* expanded lines with product + computed prices */
    lines() {
      return cart.all().map((l) => {
        const p = byId(l.id);
        if (!p) return null;
        const optIdx = p.options ? Math.max(0, p.options.values.indexOf(l.opt)) : 0;
        const price = unitPrice(p, optIdx), mrp = unitMrp(p, optIdx);
        return { ...l, p, price, mrp, total: price * l.qty, mrpTotal: mrp * l.qty };
      }).filter(Boolean);
    }
  };

  /* ---------- saved for later ---------- */
  const saved = {
    all: () => read(KEYS.saved, []),
    add(line) { const s = saved.all().filter((x) => x.key !== line.key); s.push({ key: line.key, id: line.id, qty: line.qty, color: line.color, opt: line.opt }); write(KEYS.saved, s); },
    remove(key) { write(KEYS.saved, saved.all().filter((x) => x.key !== key)); }
  };

  /* ---------- coupon + totals ---------- */
  const coupon = {
    get: () => read(KEYS.coupon, null),
    apply(code, subtotal) {
      code = (code || "").trim().toUpperCase();
      const c = COUPONS[code];
      if (!c) return { ok: false, msg: "That coupon code isn't valid." };
      if (subtotal < c.min) return { ok: false, msg: `Add ${inr(c.min - subtotal)} more to use ${code}.` };
      write(KEYS.coupon, code);
      return { ok: true, msg: `${code} applied — ${c.label}.` };
    },
    remove() { localStorage.removeItem(KEYS.coupon); document.dispatchEvent(new CustomEvent("lm:change", { detail: KEYS.coupon })); }
  };

  const FREE_SHIP_MIN = 499;
  function totals(opts = {}) {
    const lines = cart.lines();
    const mrp = lines.reduce((s, l) => s + l.mrpTotal, 0);
    const subtotal = lines.reduce((s, l) => s + l.total, 0);
    let couponCode = coupon.get(), couponOff = 0;
    if (couponCode && COUPONS[couponCode]) {
      const c = COUPONS[couponCode];
      if (subtotal >= c.min) couponOff = c.type === "pct" ? Math.min(Math.round(subtotal * c.value / 100), c.cap) : c.value;
      else couponCode = null;
    } else couponCode = null;
    const shipping = !lines.length ? 0 : opts.express ? 149 : subtotal >= FREE_SHIP_MIN ? 0 : 40;
    const codFee = opts.cod ? 25 : 0;
    const platform = lines.length ? 9 : 0;
    const grand = Math.max(0, subtotal - couponOff + shipping + codFee + platform);
    return { lines, mrp, subtotal, discount: mrp - subtotal, couponCode, couponOff, shipping, codFee, platform, grand, saved: mrp - subtotal + couponOff };
  }

  /* ---------- wishlist ---------- */
  const wish = {
    all: () => read(KEYS.wish, []),
    has: (id) => wish.all().includes(id),
    toggle(id) {
      const w = wish.all();
      const i = w.indexOf(id);
      if (i >= 0) w.splice(i, 1); else w.unshift(id);
      write(KEYS.wish, w);
      return i < 0;
    }
  };

  /* ---------- recently viewed ---------- */
  const recent = {
    all: () => read(KEYS.recent, []),
    push(id) { const r = recent.all().filter((x) => x !== id); r.unshift(id); write(KEYS.recent, r.slice(0, 12)); }
  };

  /* ---------- orders ---------- */
  const orders = {
    all: () => read(KEYS.orders, []),
    get: (id) => orders.all().find((o) => o.id === id),
    create(o) {
      const all = orders.all();
      const id = "LM-" + new Date().getFullYear().toString().slice(2) + Math.floor(100000 + Math.random() * 899999);
      const order = { ...o, id, placed: Date.now(), status: "Confirmed" };
      all.unshift(order);
      write(KEYS.orders, all);
      return order;
    },
    cancel(id) {
      const all = orders.all();
      const o = all.find((x) => x.id === id);
      if (o) { o.status = "Cancelled"; o.cancelledAt = Date.now(); }
      write(KEYS.orders, all);
    }
  };

  /* ---------- delivery estimate ---------- */
  const pin = {
    get: () => read(KEYS.pin, null),
    set: (v) => write(KEYS.pin, v)
  };
  function deliveryDate(days) {
    const d = new Date(); d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }
  function etaDays(pincode, express) {
    if (!pincode) return express ? 1 : 4;
    const zone = Number(String(pincode)[0]);       // 1–8: Indian postal zones
    const base = [0, 2, 3, 3, 4, 3, 4, 5, 6][zone] || 5;
    return express ? Math.max(1, base - 2) : base;
  }

  const address = { get: () => read(KEYS.addr, null), set: (v) => write(KEYS.addr, v) };

  return { inr, pct, byId, catName, param, esc, unitPrice, unitMrp, cart, saved, coupon, totals, wish, recent, orders, pin, address, deliveryDate, etaDays, FREE_SHIP_MIN };
})();
