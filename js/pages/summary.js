/* Price summary block shared by cart and checkout */
function summaryHtml(t, { cta = "", showCoupon = true } = {}) {
  const coupon = !showCoupon ? "" : t.couponCode
    ? `<div class="applied"><span>${ico("tag", 16)} <b>${t.couponCode}</b> applied · −${LM.inr(t.couponOff)}</span><button class="link" data-coupon-remove>Remove</button></div>`
    : `<form class="coupon-form" data-coupon><input class="field" placeholder="Coupon code" aria-label="Coupon code"><button class="btn btn-sm btn-ghost" style="height:42px">Apply</button></form>
       <p class="coupon-hint">Try: ${Object.keys(COUPONS).map((c) => `<button type="button" data-try="${c}" title="${COUPONS[c].label}">${c}</button>`).join("")}</p>
       <p class="field-err" data-coupon-err hidden></p>`;
  return `
    <h3>Price details · ${t.lines.reduce((s, l) => s + l.qty, 0)} items</h3>
    <div class="sum-row"><span>Price (M.R.P.)</span><span>${LM.inr(t.mrp)}</span></div>
    <div class="sum-row disc"><span>Discount on M.R.P.</span><span>− ${LM.inr(t.discount)}</span></div>
    ${t.couponOff ? `<div class="sum-row disc"><span>Coupon (${t.couponCode})</span><span>− ${LM.inr(t.couponOff)}</span></div>` : ""}
    <div class="sum-row"><span>Delivery</span><span>${t.shipping ? LM.inr(t.shipping) : '<span class="ok">FREE</span>'}</span></div>
    ${t.codFee ? `<div class="sum-row"><span>Cash on delivery fee</span><span>${LM.inr(t.codFee)}</span></div>` : ""}
    <div class="sum-row"><span>Platform fee</span><span>${LM.inr(t.platform)}</span></div>
    <div class="sum-total"><span>Total amount</span><span>${LM.inr(t.grand)}</span></div>
    ${t.saved > 0 ? `<div class="savings">You save ${LM.inr(t.saved)} on this order</div>` : ""}
    ${cta}
    ${coupon}`;
}

/* wires coupon form inside a container; onChange re-renders */
function bindCoupon(root, onChange) {
  root.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-coupon]"); if (!f) return;
    e.preventDefault();
    const res = LM.coupon.apply(f.querySelector("input").value, LM.totals().subtotal);
    if (res.ok) { toast(res.msg); onChange(); }
    else { const err = root.querySelector("[data-coupon-err]"); err.textContent = res.msg; err.hidden = false; }
  });
  root.addEventListener("click", (e) => {
    const t = e.target.closest("[data-try]");
    if (t) { const f = root.querySelector("[data-coupon] input"); f.value = t.dataset.try; f.form.requestSubmit(); }
    if (e.target.closest("[data-coupon-remove]")) { LM.coupon.remove(); onChange(); }
  });
}
