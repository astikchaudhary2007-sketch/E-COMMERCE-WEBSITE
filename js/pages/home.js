/* Home page */
document.addEventListener("DOMContentLoaded", () => {
  /* ---- hero slides ---- */
  const SLIDES = [
    { id: "LM1001", eyebrow: "Just landed", h: "iPhone 15.<br>Now ₹8,000 less.", p: "Dynamic Island, 48MP camera and USB‑C. Plus 10% off with HDFC cards.", bg: "#14161c", color: "#fff" },
    { id: "LM1102", eyebrow: "Audio week", h: "Silence,<br>on demand.", p: "Sony WH‑1000XM5 — industry-leading noise cancellation with 30-hour battery.", bg: "#2a221c", color: "#fff" },
    { id: "LM3002", eyebrow: "Kitchen loot", h: "Crispy, with<br>90% less oil.", p: "Philips 4.1 L Air Fryer. Fry, bake, grill and roast at home.", bg: "#1d2b25", color: "#fff" }
  ];
  const slidesEl = document.getElementById("slides");
  slidesEl.innerHTML = SLIDES.map((s, i) => {
    const p = LM.byId(s.id);
    return `<div class="slide ${i ? "" : "on"}" style="--slide-bg:${s.bg};background:${s.bg};color:${s.color}">
      <div class="slide-copy">
        <span class="eyebrow">${s.eyebrow}</span>
        <h1>${s.h}</h1>
        <p>${s.p}</p>
        <p class="price-tag"><b>${LM.inr(p.price)}</b><s>${LM.inr(p.mrp)}</s></p>
        <a class="btn btn-accent" href="product.html?id=${p.id}">Shop now</a>
      </div>
      <div class="slide-art">${productImg(p)}</div>
    </div>`;
  }).join("") + `<div class="dots">${SLIDES.map((_, i) => `<button class="${i ? "" : "on"}" aria-label="Slide ${i + 1}"></button>`).join("")}</div>`;
  let cur = 0, timer;
  const go = (n) => {
    const slides = slidesEl.querySelectorAll(".slide"), dots = slidesEl.querySelectorAll(".dots button");
    slides[cur].classList.remove("on"); dots[cur].classList.remove("on");
    cur = (n + SLIDES.length) % SLIDES.length;
    slides[cur].classList.add("on"); dots[cur].classList.add("on");
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5500); };
  slidesEl.querySelectorAll(".dots button").forEach((b, i) => b.addEventListener("click", () => { go(i); auto(); }));
  auto();

  document.getElementById("promo-book").src = bookCover(LM.byId("LM5002"));

  /* ---- categories ---- */
  document.getElementById("cats").innerHTML = CATEGORIES.map((c) => {
    const rep = PRODUCTS.find((p) => p.cat === c.id);
    return `<a class="cat-tile" href="shop.html?cat=${c.id}" style="--tone:${c.tone}"><b>${c.name}</b><span>${c.blurb}</span>${productImg(rep)}</a>`;
  }).join("");

  /* ---- deals: biggest discount ---- */
  const deals = [...PRODUCTS].sort((a, b) => LM.pct(b.price, b.mrp) - LM.pct(a.price, a.mrp)).slice(0, 10);
  document.getElementById("deals").innerHTML = deals.map(productCard).join("");
  const tEl = document.getElementById("timer").querySelectorAll("span");
  const tick = () => {
    const now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0);
    let s = Math.floor((end - now) / 1000);
    const parts = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60];
    parts.forEach((v, i) => (tEl[i].textContent = String(v).padStart(2, "0")));
  };
  tick(); setInterval(tick, 1000);

  /* ---- bestsellers ---- */
  document.getElementById("best").innerHTML = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 10).map(productCard).join("");

  /* ---- electronics ---- */
  document.getElementById("elec").innerHTML = PRODUCTS.filter((p) => p.cat === "electronics").sort((a, b) => b.rating - a.rating).slice(0, 10).map(productCard).join("");

  /* ---- brands ---- */
  const brandList = ["Apple", "Samsung", "Sony", "boAt", "Philips", "Levi's", "Nike", "LEGO"];
  document.getElementById("brands").innerHTML = brandList.map((b) => `<a href="shop.html?brand=${encodeURIComponent(b)}">${b}</a>`).join("");

  /* ---- recently viewed ---- */
  const rec = LM.recent.all().map(LM.byId).filter(Boolean);
  if (rec.length) {
    document.getElementById("recent-sec").hidden = false;
    document.getElementById("recent").innerHTML = rec.map(productCard).join("");
  }
});
