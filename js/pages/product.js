/* Product detail page */
document.addEventListener("DOMContentLoaded", () => {
  const p = LM.byId(LM.param("id")) || PRODUCTS[0];
  LM.recent.push(p.id);
  document.title = `${p.title} — Loot Market`;

  const sel = { color: p.colors ? 0 : null, opt: 0, qty: 1 };
  const $ = (id) => document.getElementById(id);

  /* gallery: imgix (Unsplash) focal-point crops give alternate views */
  const views = p.cover
    ? [bookCover(p)]
    : [p.img, p.img + "&crop=focalpoint&fp-x=.35&fp-y=.5&fp-z=1.7", p.img + "&crop=focalpoint&fp-x=.65&fp-y=.45&fp-z=2.2", p.img + "&sat=-100"];

  /* seeded random for stable fake reviews */
  let seed = [...p.id].reduce((s, c) => s * 31 + c.charCodeAt(0), 7) % 2147483647;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const cat = CATEGORIES.find((c) => c.id === p.cat);
  $("crumbs").innerHTML = `<a href="index.html">Home</a>${ico("chev", 12)}<a href="shop.html?cat=${p.cat}">${cat.name}</a>${ico("chev", 12)}<a href="shop.html?cat=${p.cat}&sub=${encodeURIComponent(p.sub)}">${p.sub}</a>${ico("chev", 12)}<span>${LM.esc(p.brand)}</span>`;

  function render() {
    const price = LM.unitPrice(p, sel.opt), mrp = LM.unitMrp(p, sel.opt), off = LM.pct(price, mrp);
    const pin = LM.pin.get();
    const eta = LM.deliveryDate(LM.etaDays(pin));
    const fast = LM.deliveryDate(LM.etaDays(pin, true));
    const emi = Math.round(price / 6);
    $("pdp").innerHTML = `
      <div class="gallery">
        <div class="thumbs">${views.map((v, i) => `<button class="${i ? "" : "on"}" data-view="${i}" aria-label="View ${i + 1}"><img src="${v}" alt="" onerror="lmImgFail(this,'${p.id}')"></button>`).join("")}</div>
        <div class="stage" id="stage">
          <img id="stage-img" src="${views[0]}" alt="${LM.esc(p.title)}" onerror="lmImgFail(this,'${p.id}')">
          <button class="wish-btn ${LM.wish.has(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Save to wishlist">${ico("heart", 20)}</button>
        </div>
      </div>

      <div class="info">
        <a class="brand-link" href="shop.html?brand=${encodeURIComponent(p.brand)}">Visit the ${LM.esc(p.brand)} store</a>
        <h1>${LM.esc(p.title)}</h1>
        <div class="rating-line">
          <span class="score">${p.rating.toFixed(1)} ★</span>
          ${stars(p.rating, 15)}
          <a href="#tabs" data-jump="reviews">${p.reviews.toLocaleString("en-IN")} ratings</a>
          ${p.badge ? `<span class="badge" style="position:static">${LM.esc(p.badge)}</span>` : ""}
        </div>
        <hr class="hr">
        <div class="big-price">${off ? `<span class="off">-${off}%</span>` : ""}<span class="price">${LM.inr(price)}</span></div>
        <p>M.R.P.: <s>${LM.inr(mrp)}</s> · Inclusive of all taxes ${price >= 3000 ? `· EMI from <b>${LM.inr(emi)}/mo</b>` : ""}</p>
        <div class="offers">${OFFERS.map((o) => `<div class="offer"><b>${o.tag}</b>${o.text}</div>`).join("")}</div>

        ${p.colors ? `<div class="variant"><h4>Colour: <b>${p.colors[sel.color][0]}</b></h4><div class="swatches">
          ${p.colors.map(([n, hex], i) => `<button class="swatch ${i === sel.color ? "on" : ""}" style="background:${hex}" data-color="${i}" title="${n}" aria-label="${n}"></button>`).join("")}</div></div>` : ""}
        ${p.options ? `<div class="variant"><h4>${p.options.label}: <b>${p.options.values[sel.opt]}</b></h4><div class="opts">
          ${p.options.values.map((v, i) => `<button class="opt ${i === sel.opt ? "on" : ""}" data-opt="${i}">${v}</button>`).join("")}</div></div>` : ""}

        <hr class="hr">
        <h3>About this item</h3>
        <ul class="bullets">${p.highlights.map((h) => `<li>${LM.esc(h)}</li>`).join("")}</ul>
      </div>

      <aside class="buybox panel">
        <div class="price-row"><span class="price">${LM.inr(price * sel.qty)}</span>${sel.qty > 1 ? `<span class="muted">(${sel.qty} × ${LM.inr(price)})</span>` : ""}</div>
        <div class="eta-box" style="margin-top:10px">
          ${price >= LM.FREE_SHIP_MIN ? "<b>FREE delivery</b>" : "Delivery ₹40"} <b>${eta}</b>.<br>
          Or fastest delivery <b>${fast}</b> with Express (₹149).
        </div>
        <form class="pin-check" id="pin-check">
          <input class="field" inputmode="numeric" maxlength="6" placeholder="Enter pincode" value="${pin || ""}">
          <button class="btn btn-sm btn-ghost">Check</button>
        </form>
        <p class="muted" style="font-size:12.5px">${ico("pin", 13)} ${pin ? "Delivering to " + pin : "Enter a pincode for exact dates"}</p>
        <p class="stock ${p.stock <= 10 ? "low" : "in"}">${p.stock <= 10 ? `Only ${p.stock} left in stock — order soon` : "In stock"}</p>
        <div style="display:flex;align-items:center;gap:12px"><span class="muted" style="font-size:13.5px">Quantity</span>
          <div class="qty"><button data-q="-1" aria-label="Decrease">−</button><span>${sel.qty}</span><button data-q="1" aria-label="Increase">+</button></div>
        </div>
        <div class="buy-ctas">
          <button class="btn btn-accent btn-block" id="add">${ico("bag", 18)} Add to cart</button>
          <button class="btn btn-block" id="buy">Buy now</button>
        </div>
        <div class="trust">
          <div>${ico("ret", 20)}7-day return</div>
          <div>${ico("truck", 20)}Loot delivered</div>
          <div>${ico("shield", 20)}Secure payment</div>
        </div>
        <hr class="hr" style="margin:14px 0">
        <div class="seller">
          <span>Ships from</span><b>Loot Market</b>
          <span>Sold by</span><b>${LM.esc(p.brand)} Retail India</b>
          <span>Payment</span><b>Secure transaction</b>
          <span>Item code</span><b>${p.id}</b>
        </div>
      </aside>`;
  }

  /* ---- tabs ---- */
  function reviewsHtml() {
    const dist = [5, 4, 3, 2, 1].map((s) => Math.max(0.02, 1 - Math.abs(s - p.rating) / 2.2));
    const sum = dist.reduce((a, b) => a + b, 0);
    const names = ["Rahul S.", "Priya M.", "Aditya K.", "Sneha R.", "Vikram P.", "Ananya G.", "Karan J.", "Meera N."];
    const cities = ["Bengaluru", "Pune", "Delhi", "Mumbai", "Jaipur", "Kolkata", "Chennai", "Lucknow"];
    const lines = {
      5: [["Absolutely worth it", "Exactly as described. Build quality is excellent and delivery was a day early."], ["Best purchase this year", "Been using it daily for a month now — zero complaints. Packaging was solid too."]],
      4: [["Good value for money", "Does everything I needed. Minor nitpicks, but at this price it's a great buy."], ["Very good, not perfect", "Quality is impressive. Took a little getting used to, otherwise happy."]],
      3: [["Decent, does the job", "It's okay. Expected slightly better finish for the price, but works fine."]]
    };
    const count = 5;
    const reviews = Array.from({ length: count }, (_, i) => {
      const r = Math.max(3, Math.min(5, Math.round(p.rating + (rnd() - .45) * 1.6)));
      const pick = lines[r][Math.floor(rnd() * lines[r].length)];
      const d = new Date(); d.setDate(d.getDate() - Math.floor(rnd() * 120) - 3);
      return { r, title: pick[0], body: pick[1], name: names[(i + Math.floor(rnd() * 8)) % 8], city: cities[Math.floor(rnd() * 8)], date: d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), helpful: Math.floor(rnd() * 180) };
    });
    return `<div class="reviews">
      <div class="rv-summary">
        <div class="big">${p.rating.toFixed(1)}<span class="muted" style="font-size:18px;font-weight:500"> / 5</span></div>
        ${stars(p.rating, 18)}
        <p class="muted" style="margin:6px 0 16px">${p.reviews.toLocaleString("en-IN")} global ratings</p>
        ${[5, 4, 3, 2, 1].map((s, i) => { const w = Math.round((dist[i] / sum) * 100); return `<div class="bar-row"><span>${s} star</span><div class="bar"><span style="width:${w}%"></span></div><span class="muted">${w}%</span></div>`; }).join("")}
        <hr class="hr">
        <h4 style="font-family:var(--font);font-size:15px">Review this product</h4>
        <p class="muted" style="font-size:13.5px;margin:4px 0 12px">Share your thoughts with other customers.</p>
        <button class="btn btn-ghost btn-sm btn-block" id="write-review">Write a review</button>
      </div>
      <div id="review-list">${reviews.map((v) => `
        <article class="review">
          <header><span class="avatar">${v.name[0]}</span><b>${v.name}</b></header>
          ${stars(v.r, 13)} <h5 style="display:inline;margin-left:6px">${v.title}</h5>
          <p class="meta">Reviewed in ${v.city} on ${v.date} · <span class="verified">Verified purchase</span></p>
          <p style="margin-top:6px">${v.body}</p>
          <p class="meta" style="margin-top:8px">${v.helpful} people found this helpful</p>
        </article>`).join("")}</div>
    </div>`;
  }
  const TABS = {
    desc: () => `<div style="max-width:820px"><h3 style="font-size:19px;margin-bottom:10px">Product description</h3>
      <p style="color:var(--ink-2);margin-bottom:14px">The ${LM.esc(p.title)} from ${LM.esc(p.brand)} is one of our most-loved picks in ${p.sub.toLowerCase()}, rated ${p.rating}/5 by ${p.reviews.toLocaleString("en-IN")} customers. Here's what you get:</p>
      <ul class="bullets">${p.highlights.map((h) => `<li>${LM.esc(h)}</li>`).join("")}</ul></div>`,
    specs: () => `<table class="specs"><tbody>
      <tr><th>Brand</th><td>${LM.esc(p.brand)}</td></tr>
      ${Object.entries(p.specs).map(([k, v]) => `<tr><th>${LM.esc(k)}</th><td>${LM.esc(v)}</td></tr>`).join("")}
      ${p.colors ? `<tr><th>Colours available</th><td>${p.colors.map((c) => c[0]).join(", ")}</td></tr>` : ""}
      ${p.options ? `<tr><th>${p.options.label}</th><td>${p.options.values.join(", ")}</td></tr>` : ""}
      <tr><th>Category</th><td>${cat.name} › ${p.sub}</td></tr>
      <tr><th>Item code</th><td>${p.id}</td></tr></tbody></table>`,
    reviews: reviewsHtml,
    ship: () => `<div style="max-width:820px;display:grid;gap:14px;color:var(--ink-2)">
      <p><b>Standard delivery:</b> free on orders above ₹499, otherwise ₹40. Usually ${LM.etaDays(LM.pin.get())}–${LM.etaDays(LM.pin.get()) + 2} business days.</p>
      <p><b>Express delivery:</b> ₹149, arrives in ${LM.etaDays(LM.pin.get(), true)} day(s) in most metro pincodes.</p>
      <p><b>Returns:</b> 7-day replacement or refund if the item is damaged, defective or different from the description. Pickup is free.</p>
      <p><b>Warranty:</b> Covered by the manufacturer's warranty. Keep your Loot Market invoice for claims.</p>
      <p><a class="link" href="help.html#returns">Read the full returns policy</a></p></div>`
  };
  let tab = "desc";
  const renderTab = () => {
    $("tab-body").innerHTML = TABS[tab]();
    document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
    const w = $("write-review");
    if (w) w.onclick = () => toast("Thanks! Reviews open 24 hours after delivery.");
  };
  $("tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) { tab = b.dataset.tab; renderTab(); } });

  /* ---- interactions ---- */
  $("pdp").addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) return;
    if (t.dataset.view !== undefined) {
      $("stage-img").src = views[t.dataset.view];
      document.querySelectorAll(".thumbs button").forEach((b) => b.classList.toggle("on", b === t));
    } else if (t.dataset.color !== undefined) { sel.color = Number(t.dataset.color); render(); }
    else if (t.dataset.opt !== undefined) { sel.opt = Number(t.dataset.opt); render(); }
    else if (t.dataset.q) { sel.qty = Math.max(1, Math.min(sel.qty + Number(t.dataset.q), Math.min(10, p.stock))); render(); }
    else if (t.dataset.jump) { e.preventDefault(); tab = "reviews"; renderTab(); $("tabs").scrollIntoView({ behavior: "smooth" }); }
    else if (t.id === "add" || t.id === "buy") {
      const color = p.colors ? p.colors[sel.color][0] : null;
      const opt = p.options ? p.options.values[sel.opt] : null;
      LM.cart.add(p.id, sel.qty, color, opt);
      if (t.id === "buy") location.href = "checkout.html";
      else openMiniCart(p.id);
    }
  });
  $("pdp").addEventListener("submit", (e) => {
    if (e.target.id !== "pin-check") return;
    e.preventDefault();
    const v = e.target.querySelector("input").value.trim();
    if (!/^[1-8]\d{5}$/.test(v)) { toast("Enter a valid 6-digit pincode", "err"); return; }
    LM.pin.set(v);
    const lbl = document.getElementById("pin-label"); if (lbl) lbl.textContent = "India " + v;
    render();
    toast(`Delivery by <b>${LM.deliveryDate(LM.etaDays(v))}</b> to ${v}`);
  });
  /* hover zoom */
  $("pdp").addEventListener("mousemove", (e) => {
    const st = e.target.closest("#stage"); if (!st) return;
    const r = st.getBoundingClientRect();
    $("stage-img").style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  });
  $("pdp").addEventListener("mouseover", (e) => { const st = e.target.closest("#stage"); if (st && !e.target.closest(".wish-btn")) st.classList.add("zoom"); });
  $("pdp").addEventListener("mouseout", (e) => { const st = e.target.closest("#stage"); if (st && !st.contains(e.relatedTarget)) st.classList.remove("zoom"); });

  render();
  renderTab();

  /* similar */
  const sim = PRODUCTS.filter((x) => x.id !== p.id && (x.sub === p.sub || x.cat === p.cat)).sort((a, b) => (b.sub === p.sub) - (a.sub === p.sub) || b.rating - a.rating).slice(0, 10);
  $("sim-sub").textContent = `More from ${cat.name}`;
  $("similar").innerHTML = sim.map(productCard).join("");
});
