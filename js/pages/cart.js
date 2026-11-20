/* Cart page */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("cart-root");

  const lineHtml = (l, savedMode = false) => {
    const off = LM.pct(l.price, l.mrp);
    const eta = LM.deliveryDate(LM.etaDays(LM.pin.get()));
    return `<div class="line" data-key="${LM.esc(l.key)}">
      <a href="product.html?id=${l.p.id}">${productImg(l.p)}</a>
      <div>
        <a class="line-title" href="product.html?id=${l.p.id}">${LM.esc(l.p.title)}</a>
        <div class="line-meta">
          ${l.color ? `<span>Colour: <b>${LM.esc(l.color)}</b></span>` : ""}
          ${l.opt ? `<span>${l.p.options.label}: <b>${LM.esc(l.opt)}</b></span>` : ""}
          <span>Sold by ${LM.esc(l.p.brand)} Retail</span>
        </div>
        <p class="${l.p.stock <= 10 ? "stock low" : "stock in"}" style="margin:0 0 8px;font-size:13px">${l.p.stock <= 10 ? `Only ${l.p.stock} left` : "In stock"} · <span class="muted" style="font-weight:400">Delivery by ${eta}</span></p>
        <div class="line-ctl">
          ${savedMode
            ? `<button class="btn btn-sm" data-act="move">Move to cart</button><button class="link" data-act="del-saved">Remove</button>`
            : `<div class="qty"><button data-act="dec" aria-label="Decrease">−</button><span>${l.qty}</span><button data-act="inc" aria-label="Increase">+</button></div>
               <button class="link" data-act="save">Save for later</button>
               <button class="link" data-act="del">${ico("trash", 14)} Remove</button>`}
        </div>
      </div>
      <div class="line-price">
        <span class="price">${LM.inr(savedMode ? l.price : l.total)}</span>
        ${off ? `<span class="mrp">${LM.inr(savedMode ? l.mrp : l.mrpTotal)}</span> <span class="off">${off}% off</span>` : ""}
      </div>
    </div>`;
  };

  function render() {
    const t = LM.totals();
    if (!t.lines.length) {
      root.innerHTML = `<div class="empty panel" style="margin:18px 0 10px">
        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="var(--line-2)" stroke-width="1.2" style="margin:0 auto 14px">${ICON.bag}</svg>
        <h3>Your cart is empty</h3><p>Looks like you haven't added anything yet. Deals are waiting.</p>
        <a class="btn btn-accent" href="shop.html?deals=1">Explore today's deals</a></div>`;
    } else {
      const toFree = LM.FREE_SHIP_MIN - t.subtotal;
      root.innerHTML = `<div class="cart-layout">
        <section class="cart-list">
          ${toFree > 0
            ? `<div class="notice warn">${ico("truck", 18)} Add <b>&nbsp;${LM.inr(toFree)}&nbsp;</b> more to get FREE delivery</div>`
            : `<div class="notice">${ico("check", 18)} Your order is eligible for FREE delivery</div>`}
          <div class="panel">${t.lines.map((l) => lineHtml(l)).join("")}</div>
        </section>
        <aside class="summary panel" id="summary">
          ${summaryHtml(t, { cta: `<a class="btn btn-accent btn-block" href="checkout.html">${ico("lock", 16)} Proceed to checkout</a>` })}
          <p class="secure-note">${ico("shield", 16)} Safe and secure payments. 100% authentic products.</p>
        </aside>
      </div>`;
    }

    const saved = LM.saved.all().map((s) => {
      const p = LM.byId(s.id); if (!p) return null;
      const oi = p.options ? Math.max(0, p.options.values.indexOf(s.opt)) : 0;
      return { ...s, p, price: LM.unitPrice(p, oi), mrp: LM.unitMrp(p, oi) };
    }).filter(Boolean);
    document.getElementById("saved-sec").hidden = !saved.length;
    document.getElementById("saved").innerHTML = saved.map((l) => lineHtml(l, true)).join("");
  }

  document.querySelector("main").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const key = b.closest(".line").dataset.key;
    const line = LM.cart.all().find((l) => l.key === key);
    switch (b.dataset.act) {
      case "inc": LM.cart.setQty(key, line.qty + 1); if (line.qty + 1 > Math.min(10, LM.byId(line.id).stock)) toast("That's the maximum per order", "err"); break;
      case "dec": line.qty > 1 ? LM.cart.setQty(key, line.qty - 1) : LM.cart.remove(key); break;
      case "del": LM.cart.remove(key); toast("Removed from cart"); break;
      case "save": LM.saved.add(line); LM.cart.remove(key); toast("Moved to Saved for later"); break;
      case "move": { const s = LM.saved.all().find((x) => x.key === key); LM.cart.add(s.id, s.qty, s.color, s.opt); LM.saved.remove(key); toast("Moved to cart"); break; }
      case "del-saved": LM.saved.remove(key); break;
    }
    render();
  });
  bindCoupon(root, render);

  render();
  const inCart = new Set(LM.cart.all().map((l) => l.id));
  const cats = new Set(LM.cart.lines().map((l) => l.p.cat));
  document.getElementById("recs").innerHTML = PRODUCTS.filter((p) => !inCart.has(p.id) && (!cats.size || cats.has(p.cat))).sort((a, b) => b.reviews - a.reviews).slice(0, 10).map(productCard).join("");
  document.addEventListener("lm:change", (e) => { if (e.detail === "lm_cart") render(); });
});
