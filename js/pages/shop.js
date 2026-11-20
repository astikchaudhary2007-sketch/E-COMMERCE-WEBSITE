/* Shop / listing page with filters, sort and pagination */
document.addEventListener("DOMContentLoaded", () => {
  const PER_PAGE = 12;
  const sp = new URLSearchParams(location.search);
  const state = {
    q: sp.get("q") || "",
    cat: sp.get("cat") || "",
    subs: sp.getAll("sub"),
    brands: sp.getAll("brand"),
    min: sp.get("min") || "",
    max: sp.get("max") || "",
    rating: Number(sp.get("rating") || 0),
    disc: Number(sp.get("disc") || (sp.get("deals") ? 40 : 0)),
    sort: sp.get("sort") || "relevance",
    page: Number(sp.get("page") || 1)
  };

  const $ = (id) => document.getElementById(id);
  const filtersEl = $("filters");

  /* base set = query + category only; facets are counted against it */
  function baseSet() {
    const q = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    return PRODUCTS.filter((p) => {
      if (state.cat && p.cat !== state.cat) return false;
      if (q.length) {
        const hay = (p.title + " " + p.brand + " " + p.sub + " " + LM.catName(p.cat)).toLowerCase();
        if (!q.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }
  function apply(list) {
    return list.filter((p) => {
      if (state.subs.length && !state.subs.includes(p.sub)) return false;
      if (state.brands.length && !state.brands.includes(p.brand)) return false;
      if (state.min && p.price < Number(state.min)) return false;
      if (state.max && p.price > Number(state.max)) return false;
      if (state.rating && p.rating < state.rating) return false;
      if (state.disc && LM.pct(p.price, p.mrp) < state.disc) return false;
      return true;
    });
  }
  const sorters = {
    relevance: () => 0,
    popular: (a, b) => b.reviews - a.reviews,
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    discount: (a, b) => LM.pct(b.price, b.mrp) - LM.pct(a.price, a.mrp)
  };

  function syncUrl() {
    const u = new URLSearchParams();
    if (state.q) u.set("q", state.q);
    if (state.cat) u.set("cat", state.cat);
    state.subs.forEach((s) => u.append("sub", s));
    state.brands.forEach((b) => u.append("brand", b));
    if (state.min) u.set("min", state.min);
    if (state.max) u.set("max", state.max);
    if (state.rating) u.set("rating", state.rating);
    if (state.disc) u.set("disc", state.disc);
    if (state.sort !== "relevance") u.set("sort", state.sort);
    if (state.page > 1) u.set("page", state.page);
    history.replaceState(null, "", "shop.html" + (u.toString() ? "?" + u : ""));
  }

  const countBy = (list, key) => list.reduce((m, p) => ((m[p[key]] = (m[p[key]] || 0) + 1), m), {});

  function renderFilters(base) {
    const subsCount = countBy(base, "sub");
    const brandCount = countBy(base, "brand");
    const allCatCount = countBy(PRODUCTS, "cat");
    filtersEl.innerHTML = `
      <h3>Filters <button class="link" id="clear-all">Clear all</button></h3>
      <div class="fgroup"><h4>Category</h4>
        <label class="check"><input type="radio" name="cat" value="" ${!state.cat ? "checked" : ""}> All categories <span class="count">${PRODUCTS.length}</span></label>
        ${CATEGORIES.map((c) => `<label class="check"><input type="radio" name="cat" value="${c.id}" ${state.cat === c.id ? "checked" : ""}> ${c.name} <span class="count">${allCatCount[c.id] || 0}</span></label>`).join("")}
      </div>
      ${Object.keys(subsCount).length > 1 ? `<div class="fgroup"><h4>Type</h4>
        ${Object.entries(subsCount).map(([s, n]) => `<label class="check"><input type="checkbox" data-sub="${LM.esc(s)}" ${state.subs.includes(s) ? "checked" : ""}> ${LM.esc(s)} <span class="count">${n}</span></label>`).join("")}
      </div>` : ""}
      <div class="fgroup"><h4>Price</h4>
        <div class="range-row"><input class="field" id="min" inputmode="numeric" placeholder="Min ₹" value="${state.min}"><span>–</span><input class="field" id="max" inputmode="numeric" placeholder="Max ₹" value="${state.max}"></div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">
          ${[[0, 999], [1000, 4999], [5000, 19999], [20000, ""]].map(([a, b]) => `<button class="chip" style="padding:0 12px" data-range="${a}-${b}">${b ? LM.inr(a) + "–" + LM.inr(b) : LM.inr(a) + "+"}</button>`).join("")}
        </div>
      </div>
      <div class="fgroup"><h4>Customer rating</h4>
        ${[4.5, 4, 3.5].map((r) => `<label class="check"><input type="radio" name="rating" value="${r}" ${state.rating === r ? "checked" : ""}> ${stars(r, 13)} &nbsp;${r} &amp; up</label>`).join("")}
        <label class="check"><input type="radio" name="rating" value="0" ${!state.rating ? "checked" : ""}> Any rating</label>
      </div>
      <div class="fgroup"><h4>Discount</h4>
        ${[10, 25, 40, 60].map((d) => `<label class="check"><input type="radio" name="disc" value="${d}" ${state.disc === d ? "checked" : ""}> ${d}% off or more</label>`).join("")}
        <label class="check"><input type="radio" name="disc" value="0" ${!state.disc ? "checked" : ""}> Any discount</label>
      </div>
      <div class="fgroup"><h4>Brand</h4>
        ${Object.entries(brandCount).sort((a, b) => b[1] - a[1]).map(([b, n]) => `<label class="check"><input type="checkbox" data-brand="${LM.esc(b)}" ${state.brands.includes(b) ? "checked" : ""}> ${LM.esc(b)} <span class="count">${n}</span></label>`).join("")}
      </div>`;
  }

  function renderChips() {
    const chips = [];
    if (state.q) chips.push(["q", `“${state.q}”`]);
    state.subs.forEach((s) => chips.push(["sub:" + s, s]));
    state.brands.forEach((b) => chips.push(["brand:" + b, b]));
    if (state.min || state.max) chips.push(["price", `${state.min ? LM.inr(state.min) : "₹0"} – ${state.max ? LM.inr(state.max) : "any"}`]);
    if (state.rating) chips.push(["rating", `${state.rating}★ & up`]);
    if (state.disc) chips.push(["disc", `${state.disc}%+ off`]);
    $("chips").innerHTML = chips.map(([k, l]) => `<span class="chip">${LM.esc(l)}<button data-chip="${LM.esc(k)}" aria-label="Remove">${ico("close", 12)}</button></span>`).join("");
  }

  function render() {
    const base = baseSet();
    let list = apply(base);
    if (state.sort !== "relevance") list = [...list].sort(sorters[state.sort]);
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    state.page = Math.min(state.page, pages);

    const catTitle = state.cat ? LM.catName(state.cat) : state.disc >= 40 && !state.q ? "Today's deals" : "All products";
    $("shop-title").textContent = state.q ? `Results for “${state.q}”` : catTitle;
    $("shop-count").textContent = `${list.length} product${list.length === 1 ? "" : "s"}${state.q && state.cat ? " in " + LM.catName(state.cat) : ""}`;
    document.title = `${$("shop-title").textContent} — Loot Market`;
    $("crumbs").innerHTML = `<a href="index.html">Home</a>${ico("chev", 12)}<a href="shop.html">Shop</a>${state.cat ? ico("chev", 12) + `<span>${LM.catName(state.cat)}</span>` : ""}`;
    $("sort").value = state.sort;

    renderFilters(base);
    renderChips();

    const pageItems = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
    $("results").innerHTML = pageItems.length
      ? pageItems.map(productCard).join("")
      : `<div class="empty panel" style="grid-column:1/-1"><h3>Nothing matches those filters</h3><p>Try removing a filter or searching for something broader.</p><button class="btn" id="empty-clear">Clear filters</button></div>`;
    $("pager").innerHTML = pages > 1 ? Array.from({ length: pages }, (_, i) => `<button class="${i + 1 === state.page ? "on" : ""}" data-page="${i + 1}">${i + 1}</button>`).join("") : "";
    syncUrl();
  }

  const reset = () => { Object.assign(state, { q: "", subs: [], brands: [], min: "", max: "", rating: 0, disc: 0, page: 1 }); render(); };

  /* ---- events ---- */
  filtersEl.addEventListener("change", (e) => {
    const t = e.target;
    if (t.name === "cat") { state.cat = t.value; state.subs = []; state.brands = []; }
    else if (t.name === "rating") state.rating = Number(t.value);
    else if (t.name === "disc") state.disc = Number(t.value);
    else if (t.dataset.sub) state.subs = t.checked ? [...state.subs, t.dataset.sub] : state.subs.filter((s) => s !== t.dataset.sub);
    else if (t.dataset.brand) state.brands = t.checked ? [...state.brands, t.dataset.brand] : state.brands.filter((b) => b !== t.dataset.brand);
    else if (t.id === "min" || t.id === "max") state[t.id] = t.value.replace(/\D/g, "");
    state.page = 1;
    render();
  });
  filtersEl.addEventListener("click", (e) => {
    if (e.target.id === "clear-all") { state.cat = ""; reset(); }
    const r = e.target.closest("[data-range]");
    if (r) { const [a, b] = r.dataset.range.split("-"); state.min = a === "0" ? "" : a; state.max = b; state.page = 1; render(); }
  });
  $("chips").addEventListener("click", (e) => {
    const b = e.target.closest("[data-chip]"); if (!b) return;
    const k = b.dataset.chip;
    if (k === "q") state.q = "";
    else if (k.startsWith("sub:")) state.subs = state.subs.filter((s) => s !== k.slice(4));
    else if (k.startsWith("brand:")) state.brands = state.brands.filter((x) => x !== k.slice(6));
    else if (k === "price") { state.min = ""; state.max = ""; }
    else state[k] = 0;
    state.page = 1;
    render();
  });
  $("results").addEventListener("click", (e) => { if (e.target.id === "empty-clear") reset(); });
  $("sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("pager").addEventListener("click", (e) => {
    const b = e.target.closest("[data-page]"); if (!b) return;
    state.page = Number(b.dataset.page); render(); window.scrollTo({ top: 0, behavior: "smooth" });
  });
  $("filter-open").addEventListener("click", (e) => { e.stopPropagation(); filtersEl.classList.toggle("open"); });
  document.addEventListener("click", (e) => { if (filtersEl.classList.contains("open") && !filtersEl.contains(e.target)) filtersEl.classList.remove("open"); });

  render();
});
