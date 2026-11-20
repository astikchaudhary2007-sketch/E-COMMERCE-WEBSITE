/* Order rendering shared by success.html and orders.html */
const STAGES = ["Ordered", "Packed", "Shipped", "Out for delivery", "Delivered"];

function orderStage(o) {
  if (o.status === "Cancelled") return -1;
  const hours = (Date.now() - o.placed) / 36e5;
  const total = o.eta * 24;
  if (hours >= total) return 4;
  return Math.min(3, Math.floor((hours / total) * 4));
}

function orderCard(o, { actions = true } = {}) {
  const stage = orderStage(o);
  const placed = new Date(o.placed);
  const eta = new Date(o.placed); eta.setDate(eta.getDate() + o.eta);
  const fmt = (d) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const a = o.address;
  const t = o.totals;
  return `<article class="panel order-card" data-order="${o.id}">
    <div class="order-head">
      <div><small>Order placed</small><b>${fmt(placed)}</b></div>
      <div><small>Total</small><b>${LM.inr(t.grand)}</b></div>
      <div><small>Ship to</small><b>${LM.esc(a.name)}</b></div>
      <div><small>Order #</small><b>${o.id}</b></div>
      <div class="right">
        ${stage < 0 ? `<span class="status cancelled">Cancelled</span>` : `<span class="status">${ico("check", 14)} ${STAGES[stage]}</span>`}
      </div>
    </div>
    <div class="order-body">
      <div>
        ${stage >= 0 ? `<p style="font-weight:600">${stage === 4 ? "Delivered " + fmt(eta) : "Arriving by " + fmt(eta)}</p>
          <div class="track">${STAGES.map((s, i) => `<div class="${i <= stage ? "done" : ""}">${s}</div>`).join("")}</div>`
          : `<p class="muted" style="margin-bottom:12px">This order was cancelled. ${o.payment.paid ? "Your refund of " + LM.inr(t.grand) + " will reach the original payment method in 5–7 business days." : ""}</p>`}
        ${o.items.map((it) => { const p = LM.byId(it.id); return `<div class="oi">${p ? productImg(p) : ""}<div><a class="line-title" href="product.html?id=${it.id}">${LM.esc(it.title)}</a><div class="muted" style="font-size:12.5px">Qty ${it.qty}${it.color ? " · " + LM.esc(it.color) : ""}${it.opt ? " · " + LM.esc(it.opt) : ""}</div></div><b>${LM.inr(it.price * it.qty)}</b></div>`; }).join("")}
      </div>
      <div style="display:grid;gap:16px;align-content:start">
        <div class="addr-box"><h4>Delivery address</h4>${LM.esc(a.name)}<br>${LM.esc(a.line1)}${a.line2 ? ", " + LM.esc(a.line2) : ""}<br>${LM.esc(a.city)}, ${LM.esc(a.state)} ${LM.esc(a.pin)}<br>Phone: ${LM.esc(a.phone)}</div>
        <div class="addr-box"><h4>Payment</h4>${LM.esc(o.payment.label)}<br>${o.payment.paid ? '<span class="ok">Paid</span>' : "Pay on delivery"}</div>
        <div class="addr-box"><h4>Bill</h4>
          <div class="sum-row" style="padding:2px 0"><span>Items</span><span>${LM.inr(t.subtotal)}</span></div>
          ${t.couponOff ? `<div class="sum-row disc" style="padding:2px 0"><span>Coupon ${t.coupon}</span><span>−${LM.inr(t.couponOff)}</span></div>` : ""}
          <div class="sum-row" style="padding:2px 0"><span>Delivery</span><span>${t.shipping ? LM.inr(t.shipping) : "FREE"}</span></div>
          ${t.codFee ? `<div class="sum-row" style="padding:2px 0"><span>COD fee</span><span>${LM.inr(t.codFee)}</span></div>` : ""}
          <div class="sum-row" style="padding:2px 0"><span>Platform fee</span><span>${LM.inr(t.platform)}</span></div>
          <div class="sum-row" style="padding:6px 0 0;font-weight:700"><span>Total</span><span>${LM.inr(t.grand)}</span></div>
        </div>
        ${actions ? `<div style="display:grid;gap:8px">
          <button class="btn btn-sm btn-ghost" data-invoice="${o.id}">Download invoice</button>
          ${stage >= 0 && stage < 2 ? `<button class="btn btn-sm btn-ghost" data-cancel="${o.id}" style="color:var(--danger)">Cancel order</button>` : ""}
          <button class="btn btn-sm" data-reorder="${o.id}">Buy it again</button>
        </div>` : ""}
      </div>
    </div>
  </article>`;
}

/* invoice as a printable window */
function printInvoice(o) {
  const t = o.totals, a = o.address;
  const w = window.open("", "_blank");
  if (!w) { toast("Allow pop-ups to download the invoice", "err"); return; }
  w.document.write(`<!doctype html><title>Invoice ${o.id}</title><style>body{font:14px/1.5 system-ui,sans-serif;max-width:720px;margin:40px auto;color:#16161a}h1{font-size:22px;margin:0}table{width:100%;border-collapse:collapse;margin:24px 0}td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left}td:last-child,th:last-child{text-align:right}.r{text-align:right}.muted{color:#666}</style>
    <div style="display:flex;justify-content:space-between;align-items:start"><div>${LOGO_MARK}<h1>Loot Market Pvt. Ltd.</h1><p class="muted">Tax invoice · GSTIN 29AAKCL0000X1Z5 (demo)</p></div><div class="r"><b>Invoice ${o.id}</b><br>${new Date(o.placed).toLocaleString("en-IN")}</div></div>
    <p><b>Bill to:</b> ${LM.esc(a.name)}, ${LM.esc(a.line1)}, ${LM.esc(a.city)}, ${LM.esc(a.state)} ${LM.esc(a.pin)} · ${LM.esc(a.phone)}</p>
    <table><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Amount</th></tr>${o.items.map((i) => `<tr><td>${LM.esc(i.title)}</td><td>${i.qty}</td><td>${LM.inr(i.price)}</td><td>${LM.inr(i.price * i.qty)}</td></tr>`).join("")}
    ${t.couponOff ? `<tr><td colspan="3">Coupon ${t.coupon}</td><td>−${LM.inr(t.couponOff)}</td></tr>` : ""}
    <tr><td colspan="3">Delivery</td><td>${LM.inr(t.shipping)}</td></tr>${t.codFee ? `<tr><td colspan="3">COD fee</td><td>${LM.inr(t.codFee)}</td></tr>` : ""}<tr><td colspan="3">Platform fee</td><td>${LM.inr(t.platform)}</td></tr>
    <tr><th colspan="3">Grand total (incl. GST)</th><th>${LM.inr(t.grand)}</th></tr></table>
    <p class="muted">Payment: ${LM.esc(o.payment.label)} · ${o.payment.paid ? "Paid" : "Cash on delivery"}</p>
    <script>print()<\/script>`);
  w.document.close();
}

function bindOrderActions(root, rerender) {
  root.addEventListener("click", (e) => {
    const inv = e.target.closest("[data-invoice]");
    if (inv) printInvoice(LM.orders.get(inv.dataset.invoice));
    const c = e.target.closest("[data-cancel]");
    if (c && confirm("Cancel this order? This can't be undone.")) { LM.orders.cancel(c.dataset.cancel); toast("Order cancelled"); rerender(); }
    const r = e.target.closest("[data-reorder]");
    if (r) { LM.orders.get(r.dataset.reorder).items.forEach((i) => LM.cart.add(i.id, i.qty, i.color, i.opt)); location.href = "cart.html"; }
  });
}
