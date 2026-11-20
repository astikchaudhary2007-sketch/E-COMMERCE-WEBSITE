/* =====================================================================
   LOOT MARKET — shared UI: header, nav, footer, mini-cart, cards, toast
   ===================================================================== */

const ICON = {
  search: '<path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.35-4.35"/>',
  heart: '<path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z"/>',
  bag: '<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  truck: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  ret: '<path d="M4 12a8 8 0 1 0 2.3-5.6L4 8.7"/><path d="M4 4v4.7h4.7"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>'
};
const ico = (name, size = 20, extra = "") =>
  `<svg class="ico ${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;

const LOGO_MARK = `<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><rect width="40" height="40" rx="11" fill="var(--accent)"/><path d="M13.5 10v19.5H27" fill="none" stroke="#fff" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="27.2" cy="13.6" r="3.3" fill="#fff"/></svg>`;
const LOGO = `<a href="index.html" class="logo" aria-label="Loot Market home">${LOGO_MARK}<span class="logo-word"><b>Loot</b>market</span></a>`;

/* ---------- product imagery ---------- */
function bookCover(p, w = 600) {
  const c = p.cover;
  const words = c.short.split(" ");
  const lines = [];
  let cur = "";
  words.forEach((wd) => { if ((cur + " " + wd).trim().length > 12) { lines.push(cur.trim()); cur = wd; } else cur += " " + wd; });
  lines.push(cur.trim());
  const tspans = lines.map((l, i) => `<tspan x="60" dy="${i ? 58 : 0}">${LM.esc(l)}</tspan>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="#efece6"/>
    <rect x="150" y="40" width="300" height="520" rx="6" fill="${c.bg}"/>
    <rect x="150" y="40" width="14" height="520" fill="rgba(0,0,0,.12)"/>
    <g transform="translate(130 0)">
      <rect x="60" y="110" width="56" height="6" fill="${c.accent}"/>
      <text y="190" font-family="Georgia, serif" font-size="46" font-weight="700" fill="${c.fg}">${tspans}</text>
      <text x="60" y="500" font-family="Arial, sans-serif" font-size="17" letter-spacing="2" fill="${c.fg}" opacity=".85">${LM.esc(c.author.toUpperCase())}</text>
    </g></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function placeholder(p) {
  const cat = CATEGORIES.find((c) => c.id === p.cat);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="${cat ? cat.tone : "#eee"}"/>
    <text x="300" y="290" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#16161a">${LM.esc(p.brand)}</text>
    <text x="300" y="335" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#6b6b73">${LM.esc(p.sub)}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
const imgSrc = (p) => (p.cover ? bookCover(p) : p.img);
/* global so inline onerror can reach it */
window.lmImgFail = (el, id) => { el.onerror = null; el.src = placeholder(LM.byId(id)); };
const productImg = (p, cls = "") =>
  `<img class="${cls}" src="${imgSrc(p)}" alt="${LM.esc(p.title)}" loading="lazy" onerror="lmImgFail(this,'${p.id}')">`;

/* ---------- rating ---------- */
function stars(r, size = 14) {
  const pctW = (r / 5) * 100;
  return `<span class="stars" style="--s:${size}px" aria-label="${r} out of 5 stars"><span class="stars-fill" style="width:${pctW}%"></span></span>`;
}
const compact = (n) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k" : String(n));

/* ---------- product card ---------- */
function productCard(p) {
  const off = LM.pct(p.price, p.mrp);
  const wished = LM.wish.has(p.id);
  const eta = LM.deliveryDate(LM.etaDays(LM.pin.get()));
  return `
  <article class="card" data-id="${p.id}">
    <a class="card-media" href="product.html?id=${p.id}">
      ${productImg(p)}
      ${p.badge ? `<span class="badge">${LM.esc(p.badge)}</span>` : ""}
    </a>
    <button class="wish-btn ${wished ? "on" : ""}" data-wish="${p.id}" aria-label="Save to wishlist">${ico("heart", 18)}</button>
    <div class="card-body">
      <span class="card-brand">${LM.esc(p.brand)}</span>
      <a class="card-title" href="product.html?id=${p.id}">${LM.esc(p.title)}</a>
      <div class="card-rating">${stars(p.rating)} <span>${p.rating.toFixed(1)}</span><span class="muted">(${compact(p.reviews)})</span></div>
      <div class="price-row">
        <span class="price">${LM.inr(p.price)}</span>
        ${off ? `<span class="mrp">${LM.inr(p.mrp)}</span><span class="off">${off}% off</span>` : ""}
      </div>
      <p class="card-eta">${p.price >= LM.FREE_SHIP_MIN ? "Free delivery" : "Delivery ₹40"} · <b>${eta}</b></p>
      <button class="btn btn-sm btn-ghost add-btn" data-add="${p.id}">Add to cart</button>
    </div>
  </article>`;
}

/* ---------- toast ---------- */
function toast(msg, kind = "") {
  let wrap = document.querySelector(".toasts");
  if (!wrap) { wrap = document.createElement("div"); wrap.className = "toasts"; document.body.appendChild(wrap); }
  const t = document.createElement("div");
  t.className = "toast " + kind;
  t.innerHTML = msg;
  wrap.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 2600);
}

/* ---------- header ---------- */
function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const q = LM.param("q") || "";
  const curCat = LM.param("cat") || "";
  const pin = LM.pin.get();
  el.innerHTML = `
  <div class="topbar">
    <div class="wrap topbar-in">
      <p><b>Free delivery</b> on orders above ₹499 &nbsp;·&nbsp; 7-day easy returns &nbsp;·&nbsp; Extra 10% off with <b>LOOT10</b></p>
      <nav><a href="orders.html">Track order</a><a href="help.html">Help centre</a><a href="help.html#sell">Sell on Loot</a></nav>
    </div>
  </div>
  <div class="masthead">
    <div class="wrap masthead-in">
      <button class="icon-btn only-m" id="menu-toggle" aria-label="Open menu">${ico("menu", 22)}</button>
      ${LOGO}
      <button class="deliver" id="pin-btn">
        ${ico("pin", 18)}
        <span><small>Deliver to</small><b id="pin-label">${pin ? "India " + pin : "Set pincode"}</b></span>
      </button>
      <form class="search" action="shop.html" role="search" autocomplete="off">
        <select name="cat" aria-label="Category">
          <option value="">All</option>
          ${CATEGORIES.map((c) => `<option value="${c.id}" ${c.id === curCat ? "selected" : ""}>${c.name}</option>`).join("")}
        </select>
        <input name="q" type="search" placeholder="Search for products, brands and more" value="${LM.esc(q)}" aria-label="Search">
        <button type="submit" aria-label="Search">${ico("search", 20)}</button>
        <div class="suggest" hidden></div>
      </form>
      <div class="actions">
        <a href="orders.html" class="action">${ico("user", 22)}<span><small>Hello, guest</small><b>Orders</b></span></a>
        <a href="wishlist.html" class="action">${ico("heart", 22)}<span class="pill" data-count="wish"></span><span class="hide-s"><small>Saved</small><b>Wishlist</b></span></a>
        <a href="cart.html" class="action cart-action">${ico("bag", 22)}<span class="pill" data-count="cart"></span><span class="hide-s"><small>Your</small><b>Cart</b></span></a>
      </div>
    </div>
  </div>
  <nav class="catnav" id="catnav">
    <div class="wrap catnav-in">
      <a href="shop.html" class="${!curCat && location.pathname.endsWith("shop.html") ? "on" : ""}">All products</a>
      <a href="shop.html?deals=1" class="deal-link">Today's deals</a>
      ${CATEGORIES.map((c) => `<a href="shop.html?cat=${c.id}" class="${c.id === curCat ? "on" : ""}">${c.name}</a>`).join("")}
    </div>
  </nav>`;

  /* search suggestions */
  const form = el.querySelector(".search");
  const input = form.querySelector("input");
  const box = form.querySelector(".suggest");
  input.addEventListener("input", () => {
    const v = input.value.trim().toLowerCase();
    if (v.length < 2) { box.hidden = true; return; }
    const hits = PRODUCTS.filter((p) => (p.title + " " + p.brand + " " + p.sub).toLowerCase().includes(v)).slice(0, 6);
    if (!hits.length) { box.innerHTML = `<p class="suggest-empty">No matches for “${LM.esc(v)}”</p>`; box.hidden = false; return; }
    box.innerHTML = hits.map((p) => `<a href="product.html?id=${p.id}">${productImg(p)}<span><b>${LM.esc(p.title)}</b><small>${LM.esc(p.brand)} · ${LM.inr(p.price)}</small></span></a>`).join("");
    box.hidden = false;
  });
  document.addEventListener("click", (e) => { if (!form.contains(e.target)) box.hidden = true; });

  el.querySelector("#pin-btn").addEventListener("click", openPinDialog);
  el.querySelector("#menu-toggle").addEventListener("click", () => document.getElementById("catnav").classList.toggle("open"));
  updateCounts();
}

function openPinDialog() {
  const d = document.createElement("div");
  d.className = "modal-back";
  d.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="pin-h">
    <button class="icon-btn modal-x" aria-label="Close">${ico("close")}</button>
    <h3 id="pin-h">Choose your location</h3>
    <p class="muted">Delivery dates and availability depend on your pincode.</p>
    <form class="pin-form"><input class="field" inputmode="numeric" maxlength="6" placeholder="6-digit pincode" value="${LM.pin.get() || ""}"><button class="btn">Apply</button></form>
    <p class="field-err" hidden>Enter a valid 6-digit Indian pincode.</p></div>`;
  document.body.appendChild(d);
  const close = () => d.remove();
  d.addEventListener("click", (e) => { if (e.target === d) close(); });
  d.querySelector(".modal-x").onclick = close;
  const inp = d.querySelector("input");
  inp.focus();
  d.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    if (!/^[1-8]\d{5}$/.test(inp.value)) { d.querySelector(".field-err").hidden = false; return; }
    LM.pin.set(inp.value);
    document.getElementById("pin-label").textContent = "India " + inp.value;
    toast(`Delivering to <b>${inp.value}</b>`);
    close();
    document.dispatchEvent(new CustomEvent("lm:pin"));
  };
}

function updateCounts() {
  document.querySelectorAll('[data-count="cart"]').forEach((e) => { const n = LM.cart.count(); e.textContent = n; e.hidden = !n; });
  document.querySelectorAll('[data-count="wish"]').forEach((e) => { const n = LM.wish.all().length; e.textContent = n; e.hidden = !n; });
}

/* ---------- footer ---------- */
function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
  <section class="assure">
    <div class="wrap assure-in">
      <div>${ico("truck", 26)}<p><b>Fast, free delivery</b><span>On orders above ₹499 across 19,000+ pincodes</span></p></div>
      <div>${ico("ret", 26)}<p><b>7-day returns</b><span>No-questions-asked pickup from your door</span></p></div>
      <div>${ico("shield", 26)}<p><b>Secure payments</b><span>256-bit encryption, PCI-DSS compliant gateway</span></p></div>
      <div>${ico("headset", 26)}<p><b>Real humans, 24×7</b><span>Call 1800-210-LOOT or chat with us</span></p></div>
    </div>
  </section>
  <footer class="footer">
    <div class="wrap footer-grid">
      <div class="footer-brand">
        ${LOGO}
        <p>Loot Market is an online marketplace for electronics, fashion, home and more — real brands, honest prices, delivered across India.</p>
        <form class="news" onsubmit="event.preventDefault(); this.reset(); toast('Subscribed. Watch your inbox for deals.')">
          <input type="email" required placeholder="Email for weekly deals" aria-label="Email">
          <button class="btn btn-sm">Subscribe</button>
        </form>
      </div>
      <div><h4>Shop</h4>${CATEGORIES.map((c) => `<a href="shop.html?cat=${c.id}">${c.name}</a>`).join("")}</div>
      <div><h4>Your account</h4><a href="orders.html">Orders &amp; returns</a><a href="wishlist.html">Wishlist</a><a href="cart.html">Cart</a><a href="checkout.html">Checkout</a></div>
      <div><h4>Help</h4><a href="help.html#shipping">Shipping</a><a href="help.html#returns">Returns &amp; refunds</a><a href="help.html#payments">Payment options</a><a href="help.html#contact">Contact us</a></div>
    </div>
    <div class="wrap footer-base">
      <p>© ${new Date().getFullYear()} Loot Market Pvt. Ltd. · Built as a demo storefront. Product names and prices referenced from Amazon.in listings.</p>
      <div class="paychips"><span>VISA</span><span>Mastercard</span><span>RuPay</span><span>UPI</span><span>NetBanking</span><span>COD</span></div>
    </div>
  </footer>`;
}

/* ---------- mini-cart drawer ---------- */
function openMiniCart(addedId) {
  document.querySelector(".drawer-back")?.remove();
  const t = LM.totals();
  const p = LM.byId(addedId);
  const line = [...t.lines].reverse().find((l) => l.id === addedId);
  const d = document.createElement("div");
  d.className = "drawer-back";
  d.innerHTML = `<aside class="drawer" role="dialog" aria-label="Added to cart">
    <header><h3>${ico("check", 20, "ok")} Added to cart</h3><button class="icon-btn" aria-label="Close">${ico("close")}</button></header>
    ${p ? `<div class="drawer-item">${productImg(p)}<div><b>${LM.esc(p.title)}</b>${line && (line.color || line.opt) ? `<small class="muted" style="display:block">${[line.color, line.opt].filter(Boolean).map(LM.esc).join(" · ")}</small>` : ""}<span>${LM.inr(line ? line.price : p.price)}</span></div></div>` : ""}
    <div class="drawer-sum">
      <p><span>Cart subtotal (${LM.cart.count()} items)</span><b>${LM.inr(t.subtotal)}</b></p>
      ${t.subtotal < LM.FREE_SHIP_MIN
        ? `<div class="ship-meter"><span style="width:${(t.subtotal / LM.FREE_SHIP_MIN) * 100}%"></span></div><small>Add <b>${LM.inr(LM.FREE_SHIP_MIN - t.subtotal)}</b> more for free delivery</small>`
        : `<small class="ok-text">${ico("check", 14)} Your order qualifies for free delivery</small>`}
    </div>
    <div class="drawer-cta"><a class="btn btn-block" href="checkout.html">Proceed to checkout</a><a class="btn btn-block btn-ghost" href="cart.html">View cart</a></div>
    <h4 class="drawer-h">Frequently bought together</h4>
    <div class="drawer-recs">${PRODUCTS.filter((x) => p && x.cat === p.cat && x.id !== p.id).slice(0, 3).map((x) => `<a href="product.html?id=${x.id}">${productImg(x)}<span>${LM.inr(x.price)}</span></a>`).join("")}</div>
  </aside>`;
  document.body.appendChild(d);
  requestAnimationFrame(() => d.classList.add("show"));
  const close = () => { d.classList.remove("show"); setTimeout(() => d.remove(), 250); };
  d.addEventListener("click", (e) => { if (e.target === d) close(); });
  d.querySelector("header .icon-btn").onclick = close;
}

/* ---------- global delegated actions (cards everywhere) ---------- */
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    e.preventDefault();
    const p = LM.byId(add.dataset.add);
    const color = p.colors ? p.colors[0][0] : null;
    const opt = p.options ? p.options.values[0] : null;
    LM.cart.add(p.id, 1, color, opt);
    openMiniCart(p.id);
    return;
  }
  const w = e.target.closest("[data-wish]");
  if (w) {
    e.preventDefault();
    const on = LM.wish.toggle(w.dataset.wish);
    document.querySelectorAll(`[data-wish="${w.dataset.wish}"]`).forEach((b) => b.classList.toggle("on", on));
    toast(on ? `Saved to <a href="wishlist.html">wishlist</a>` : "Removed from wishlist");
  }
});
document.addEventListener("lm:change", updateCounts);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".modal-back, .drawer-back").forEach((m) => m.remove());
});

document.addEventListener("DOMContentLoaded", () => { renderHeader(); renderFooter(); });
