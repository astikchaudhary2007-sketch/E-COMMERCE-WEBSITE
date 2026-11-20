/* =====================================================================
   Checkout + payment
   The gateway below is a front-end simulation (card OTP, UPI collect,
   net-banking redirect, COD). To take real money, replace
   `runGateway()` with Razorpay Checkout / Stripe Payment Element and
   create the order on your server — never trust totals from the browser.
   Demo cards: any Luhn-valid number succeeds; 4000 0000 0000 0002 is declined.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("co-root");
  if (!LM.cart.all().length) {
    root.innerHTML = `<div class="empty panel" style="margin:20px 0 40px"><h3>Nothing to check out</h3><p>Your cart is empty.</p><a class="btn btn-accent" href="shop.html">Continue shopping</a></div>`;
    return;
  }

  const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Chandigarh", "Puducherry", "Ladakh"];
  const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra", "Yes Bank"];
  const saved = LM.address.get() || {};
  const state = { ship: "standard", method: "card", upiApp: "gpay" };

  const opts = () => ({ express: state.ship === "express", cod: state.method === "cod" });

  root.innerHTML = `
  <div class="cart-layout">
    <section>
      <form class="co-block panel" id="addr-form" novalidate>
        <h2><span class="num">1</span> Delivery address</h2>
        <p class="muted">We'll use this for delivery and your invoice.</p>
        <div class="form-grid">
          <div><label class="lbl" for="f-name">Full name</label><input class="field" id="f-name" name="name" autocomplete="name" value="${LM.esc(saved.name || "")}"></div>
          <div><label class="lbl" for="f-phone">Mobile number</label><input class="field" id="f-phone" name="phone" inputmode="numeric" maxlength="10" autocomplete="tel-national" placeholder="10-digit mobile" value="${LM.esc(saved.phone || "")}"></div>
          <div class="full"><label class="lbl" for="f-email">Email <span class="muted" style="font-weight:400">(for order updates)</span></label><input class="field" id="f-email" name="email" type="email" autocomplete="email" value="${LM.esc(saved.email || "")}"></div>
          <div class="full"><label class="lbl" for="f-line1">Flat, house no., building, street</label><input class="field" id="f-line1" name="line1" autocomplete="address-line1" value="${LM.esc(saved.line1 || "")}"></div>
          <div class="full"><label class="lbl" for="f-line2">Area, landmark <span class="muted" style="font-weight:400">(optional)</span></label><input class="field" id="f-line2" name="line2" autocomplete="address-line2" value="${LM.esc(saved.line2 || "")}"></div>
          <div><label class="lbl" for="f-pin">Pincode</label><input class="field" id="f-pin" name="pin" inputmode="numeric" maxlength="6" autocomplete="postal-code" value="${LM.esc(saved.pin || LM.pin.get() || "")}"></div>
          <div><label class="lbl" for="f-city">City</label><input class="field" id="f-city" name="city" autocomplete="address-level2" value="${LM.esc(saved.city || "")}"></div>
          <div><label class="lbl" for="f-state">State</label><select class="field" id="f-state" name="state"><option value="">Select state</option>${STATES.map((s) => `<option ${s === saved.state ? "selected" : ""}>${s}</option>`).join("")}</select></div>
          <div><label class="lbl">Address type</label>
            <div style="display:flex;gap:8px">
              <label class="radio-card" style="flex:1;padding:11px 14px"><input type="radio" name="type" value="Home" ${saved.type !== "Work" ? "checked" : ""}><b>Home</b></label>
              <label class="radio-card" style="flex:1;padding:11px 14px"><input type="radio" name="type" value="Work" ${saved.type === "Work" ? "checked" : ""}><b>Work</b></label>
            </div>
          </div>
        </div>
      </form>

      <div class="co-block panel">
        <h2><span class="num">2</span> Delivery speed</h2>
        <p class="muted">Choose how fast you want it.</p>
        <div class="ship-opts" id="ship-opts"></div>
      </div>

      <div class="co-block panel">
        <h2><span class="num">3</span> Payment method</h2>
        <p class="muted">All transactions are encrypted. We never store your card details.</p>
        <div class="pay">
          <div class="pay-tabs" role="tablist">
            <button class="on" data-m="card">Credit / Debit card<small>Visa, Mastercard, RuPay, Amex</small></button>
            <button data-m="upi">UPI<small>GPay, PhonePe, Paytm, BHIM</small></button>
            <button data-m="nb">Net banking<small>All major banks</small></button>
            <button data-m="cod">Cash on delivery<small>Pay at your door · ₹25 fee</small></button>
          </div>
          <div class="pay-body">
            <div class="pay-pane on" data-pane="card">
              <div class="card-visual" id="cv">
                <span class="brandmark" id="cv-brand"></span>
                <span class="chipx"></span>
                <span class="num" id="cv-num">•••• •••• •••• ••••</span>
                <div class="row"><span><small>Card holder</small><span id="cv-name">YOUR NAME</span></span><span><small>Expires</small><span id="cv-exp">MM/YY</span></span></div>
              </div>
              <div class="form-grid">
                <div class="full"><label class="lbl" for="c-num">Card number</label><div class="input-icon"><input class="field" id="c-num" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="23"><span class="tagx" id="c-brand"></span></div></div>
                <div class="full"><label class="lbl" for="c-name">Name on card</label><input class="field" id="c-name" autocomplete="cc-name"></div>
                <div><label class="lbl" for="c-exp">Expiry</label><input class="field" id="c-exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5"></div>
                <div><label class="lbl" for="c-cvv">CVV</label><input class="field" id="c-cvv" type="password" inputmode="numeric" autocomplete="cc-csc" placeholder="•••" maxlength="4"></div>
              </div>
              <p class="muted" style="font-size:12.5px;margin-top:12px">Demo store — use test card <b>4111 1111 1111 1111</b>, any future expiry and any CVV. <b>4000 0000 0000 0002</b> simulates a decline.</p>
            </div>

            <div class="pay-pane" data-pane="upi">
              <div class="upi-apps" id="upi-apps">
                <button type="button" class="on" data-app="gpay">Google Pay</button>
                <button type="button" data-app="phonepe">PhonePe</button>
                <button type="button" data-app="paytm">Paytm</button>
                <button type="button" data-app="id">UPI ID</button>
              </div>
              <div id="upi-id-wrap" hidden>
                <label class="lbl" for="upi-id">UPI ID</label>
                <input class="field" id="upi-id" placeholder="yourname@okhdfcbank">
              </div>
              <p class="muted" style="font-size:13.5px;margin-top:10px">You'll get a payment request on your UPI app. Approve it within 5 minutes.</p>
            </div>

            <div class="pay-pane" data-pane="nb">
              <div class="bank-grid">${BANKS.map((b, i) => `<label><input type="radio" name="bank" value="${b}" ${i ? "" : "checked"}> ${b}</label>`).join("")}</div>
              <select class="field" id="bank-other"><option value="">Other banks…</option><option>Bank of Baroda</option><option>Punjab National Bank</option><option>Canara Bank</option><option>IndusInd Bank</option><option>IDFC FIRST Bank</option><option>Union Bank of India</option></select>
            </div>

            <div class="pay-pane" data-pane="cod">
              <p style="font-size:14.5px;margin-bottom:8px"><b>Pay with cash or UPI when your order arrives.</b></p>
              <p class="muted" style="font-size:13.5px">A ₹25 handling fee applies. Available on orders up to ₹50,000. Please keep exact change ready.</p>
            </div>
            <p class="secure-note">${ico("lock", 15)} 256-bit SSL encryption · PCI-DSS compliant processing</p>
          </div>
        </div>
      </div>
    </section>

    <aside class="summary panel" id="summary"></aside>
  </div>`;

  const $ = (id) => document.getElementById(id);

  /* ---------- shipping & summary ---------- */
  function renderShip() {
    const pin = $("f-pin").value;
    const sub = LM.totals().subtotal;
    $("ship-opts").innerHTML = `
      <label class="radio-card"><input type="radio" name="ship" value="standard" ${state.ship === "standard" ? "checked" : ""}><span><b>Standard</b><small>Arrives ${LM.deliveryDate(LM.etaDays(pin))}</small></span><span class="rc-right">${sub >= LM.FREE_SHIP_MIN ? '<span class="ok">FREE</span>' : "₹40"}</span></label>
      <label class="radio-card"><input type="radio" name="ship" value="express" ${state.ship === "express" ? "checked" : ""}><span><b>Express</b><small>Arrives ${LM.deliveryDate(LM.etaDays(pin, true))}</small></span><span class="rc-right">₹149</span></label>`;
  }
  function renderSummary() {
    const t = LM.totals(opts());
    const cta = `<button class="btn btn-accent btn-block" id="place">${ico("lock", 16)} ${state.method === "cod" ? "Place order" : "Pay " + LM.inr(t.grand)}</button>`;
    $("summary").innerHTML = `
      <h3>Order summary</h3>
      <div class="co-items">${t.lines.map((l) => `<div class="co-item">${productImg(l.p)}<div><div class="t">${LM.esc(l.p.title)}</div><div class="q">Qty ${l.qty}${l.color ? " · " + LM.esc(l.color) : ""}${l.opt ? " · " + LM.esc(l.opt) : ""}</div></div><b>${LM.inr(l.total)}</b></div>`).join("")}</div>
      <a class="link" href="cart.html" style="font-size:13px">Edit cart</a>
      <hr class="hr" style="margin:12px 0">
      ${summaryHtml(t, { cta })}
      <p class="secure-note">${ico("shield", 16)} By placing this order you agree to Loot Market's conditions of use.</p>`;
  }
  const refresh = () => { renderShip(); renderSummary(); };
  bindCoupon($("summary"), renderSummary);

  $("ship-opts").addEventListener("change", (e) => { state.ship = e.target.value; refresh(); });
  $("f-pin").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, ""); if (e.target.value.length === 6) renderShip(); });
  $("f-phone").addEventListener("input", (e) => (e.target.value = e.target.value.replace(/\D/g, "")));

  /* ---------- payment tabs ---------- */
  document.querySelector(".pay-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-m]"); if (!b) return;
    state.method = b.dataset.m;
    document.querySelectorAll(".pay-tabs button").forEach((x) => x.classList.toggle("on", x === b));
    document.querySelectorAll(".pay-pane").forEach((p) => p.classList.toggle("on", p.dataset.pane === state.method));
    $("st-pay").classList.add("on");
    renderSummary();
  });
  $("upi-apps").addEventListener("click", (e) => {
    const b = e.target.closest("[data-app]"); if (!b) return;
    state.upiApp = b.dataset.app;
    document.querySelectorAll("#upi-apps button").forEach((x) => x.classList.toggle("on", x === b));
    $("upi-id-wrap").hidden = state.upiApp !== "id";
  });
  $("bank-other").addEventListener("change", (e) => { if (e.target.value) document.querySelectorAll('[name="bank"]').forEach((r) => (r.checked = false)); });

  /* ---------- card input formatting & validation ---------- */
  const cardBrand = (n) =>
    /^4/.test(n) ? "VISA" : /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(n) ? "MASTERCARD" : /^3[47]/.test(n) ? "AMEX" : /^(60|65|81|82|508)/.test(n) ? "RUPAY" : "";
  const luhn = (n) => { let s = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return s % 10 === 0; };

  $("c-num").addEventListener("input", (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 19);
    const brand = cardBrand(raw);
    e.target.value = brand === "AMEX" ? raw.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (m, a, b, c) => [a, b, c].filter(Boolean).join(" ")) : raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    $("c-brand").textContent = brand;
    $("cv-brand").textContent = brand;
    $("cv-num").textContent = (e.target.value + " •••• •••• •••• ••••".slice(e.target.value.length)).slice(0, 19) || "•••• •••• •••• ••••";
    $("c-cvv").maxLength = brand === "AMEX" ? 4 : 3;
  });
  $("c-name").addEventListener("input", (e) => ($("cv-name").textContent = e.target.value.toUpperCase() || "YOUR NAME"));
  $("c-exp").addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    e.target.value = v;
    $("cv-exp").textContent = v || "MM/YY";
  });
  $("c-cvv").addEventListener("input", (e) => (e.target.value = e.target.value.replace(/\D/g, "")));

  /* ---------- validation helpers ---------- */
  function mark(el, msg) {
    el.classList.toggle("invalid", !!msg);
    let err = el.parentElement.querySelector(".field-err");
    if (el.parentElement.classList.contains("input-icon")) err = el.parentElement.parentElement.querySelector(".field-err");
    if (msg) {
      if (!err) { err = document.createElement("p"); err.className = "field-err"; (el.parentElement.classList.contains("input-icon") ? el.parentElement.parentElement : el.parentElement).appendChild(err); }
      err.textContent = msg; err.hidden = false;
    } else if (err) err.hidden = true;
    return !msg;
  }
  function validateAddress() {
    const f = $("addr-form");
    const v = Object.fromEntries(new FormData(f));
    const checks = [
      [$("f-name"), v.name.trim().length >= 3 ? "" : "Enter your full name"],
      [$("f-phone"), /^[6-9]\d{9}$/.test(v.phone) ? "" : "Enter a valid 10-digit mobile number"],
      [$("f-email"), /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) ? "" : "Enter a valid email address"],
      [$("f-line1"), v.line1.trim().length >= 5 ? "" : "Enter your house / street address"],
      [$("f-pin"), /^[1-8]\d{5}$/.test(v.pin) ? "" : "Enter a valid 6-digit pincode"],
      [$("f-city"), v.city.trim().length >= 2 ? "" : "Enter your city"],
      [$("f-state"), v.state ? "" : "Select your state"]
    ];
    const ok = checks.map(([el, msg]) => mark(el, msg)).every(Boolean);
    if (!ok) { const first = f.querySelector(".invalid"); first.scrollIntoView({ behavior: "smooth", block: "center" }); first.focus({ preventScroll: true }); }
    return ok ? v : null;
  }
  function validatePayment(total) {
    if (state.method === "card") {
      const num = $("c-num").value.replace(/\s/g, "");
      const [mm, yy] = $("c-exp").value.split("/").map(Number);
      const now = new Date();
      const expOk = mm >= 1 && mm <= 12 && yy >= 0 && new Date(2000 + yy, mm) > now;
      const brand = cardBrand(num);
      const checks = [
        [$("c-num"), num.length >= 13 && luhn(num) && brand ? "" : "Enter a valid card number"],
        [$("c-name"), $("c-name").value.trim().length >= 3 ? "" : "Enter the name printed on the card"],
        [$("c-exp"), expOk ? "" : "Enter a valid future expiry date"],
        [$("c-cvv"), $("c-cvv").value.length === (brand === "AMEX" ? 4 : 3) ? "" : "Enter a valid CVV"]
      ];
      const ok = checks.map(([el, msg]) => mark(el, msg)).every(Boolean);
      return ok ? { type: "Card", label: `${brand} •••• ${num.slice(-4)}`, num } : null;
    }
    if (state.method === "upi") {
      if (state.upiApp === "id") {
        const v = $("upi-id").value.trim();
        if (!mark($("upi-id"), /^[\w.\-]{2,256}@[a-zA-Z][a-zA-Z0-9]{1,63}$/.test(v) ? "" : "Enter a valid UPI ID, e.g. name@okicici")) return null;
        return { type: "UPI", label: "UPI · " + v };
      }
      return { type: "UPI", label: "UPI · " + { gpay: "Google Pay", phonepe: "PhonePe", paytm: "Paytm" }[state.upiApp] };
    }
    if (state.method === "nb") {
      const bank = (document.querySelector('[name="bank"]:checked') || {}).value || $("bank-other").value;
      if (!bank) { toast("Choose your bank", "err"); return null; }
      return { type: "Net banking", label: "Net banking · " + bank, bank };
    }
    if (total > 50000) { toast("Cash on delivery is available up to ₹50,000", "err"); return null; }
    return { type: "COD", label: "Cash on delivery" };
  }

  /* ---------- simulated gateway ---------- */
  function runGateway(pay, amount) {
    return new Promise((resolve, reject) => {
      const back = document.createElement("div");
      back.className = "modal-back";
      back.innerHTML = `<div class="modal gateway" role="dialog" aria-modal="true"><div class="gw-head"><span><small class="muted">Paying Loot Market</small><b>${LM.inr(amount)}</b></span><span class="muted">${ico("lock", 14)} Secure</span></div><div id="gw"></div></div>`;
      document.body.appendChild(back);
      const gw = back.querySelector("#gw");
      const close = () => back.remove();
      const processing = (msg, ms, next) => { gw.innerHTML = `<div class="spin"></div><h3>${msg}</h3><p class="muted">Please don't refresh or press back.</p>`; setTimeout(next, ms); };
      const done = () => { gw.innerHTML = `<div class="tick">${ico("check", 34)}</div><h3>Payment successful</h3><p class="muted">Redirecting to your order…</p>`; setTimeout(() => { close(); resolve(); }, 1100); };
      const fail = (why) => { gw.innerHTML = `<div class="tick" style="background:var(--danger)">${ico("close", 30)}</div><h3>Payment failed</h3><p class="muted" style="margin-bottom:18px">${why}</p><button class="btn btn-block" id="gw-close">Try another method</button>`; gw.querySelector("#gw-close").onclick = () => { close(); reject(); }; };

      if (pay.type === "Card") {
        processing("Contacting your bank…", 1400, () => {
          if (pay.num === "4000000000000002") return fail("Your bank declined this transaction. No money was deducted.");
          gw.innerHTML = `<h3>Enter OTP</h3><p class="muted">A 6-digit code was sent to the mobile number linked with ${pay.label}.<br><small>(Demo: enter any 6 digits)</small></p>
            <div class="otp">${"<input inputmode='numeric' autocomplete='one-time-code' aria-label='OTP digit'>".repeat(6)}</div>
            <p class="field-err" id="otp-err" hidden>Enter all 6 digits</p>
            <button class="btn btn-accent btn-block" id="otp-go" style="margin-top:12px">Verify &amp; pay</button>
            <button class="link" id="otp-cancel" style="margin-top:12px">Cancel payment</button>`;
          const boxes = [...gw.querySelectorAll(".otp input")];
          boxes[0].focus();
          boxes.forEach((b, i) => {
            b.addEventListener("input", () => {
              const digits = b.value.replace(/\D/g, "").split("");
              b.value = digits.shift() || "";
              let j = i + 1;
              while (digits.length && boxes[j]) boxes[j++].value = digits.shift();   // spill pasted / fast-typed digits forward
              (boxes[b.value ? Math.min(j, 5) : i]).focus();
            });
            b.addEventListener("keydown", (e) => { if (e.key === "Backspace" && !b.value && boxes[i - 1]) boxes[i - 1].focus(); });
          });
          gw.querySelector("#otp-go").onclick = () => {
            if (boxes.some((b) => !b.value)) { gw.querySelector("#otp-err").hidden = false; return; }
            processing("Authorising payment…", 1300, done);
          };
          gw.querySelector("#otp-cancel").onclick = () => { close(); reject(); };
        });
      } else if (pay.type === "UPI") {
        let s = 300;
        const cells = Array.from({ length: 21 * 21 }, (_, i) => { const x = i % 21, y = Math.floor(i / 21); const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); const on = finder ? (x % 6 === 0 || y % 6 === 0 || (x % 14 >= 2 && x % 14 <= 4 && y % 14 >= 2 && y % 14 <= 4) || x === 20 || y === 20 || x === 14 || y === 14) : Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1 > 0.5; return on ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : ""; }).join("");
        gw.innerHTML = `<div class="upi-wait"><h3>Approve on your UPI app</h3><p class="muted">Open ${pay.label.replace("UPI · ", "")} and approve the request, or scan this code.</p>
          <svg class="qr" viewBox="0 0 21 21" shape-rendering="crispEdges" fill="#16161a">${cells}</svg>
          <p>Request expires in <b id="upi-t">5:00</b></p>
          <button class="btn btn-accent btn-block" id="upi-ok" style="margin-top:14px">I've approved the payment</button>
          <button class="link" id="upi-cancel" style="margin-top:12px">Cancel</button></div>`;
        const iv = setInterval(() => { s--; const el = gw.querySelector("#upi-t"); if (el) el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; if (s <= 0) { clearInterval(iv); fail("The payment request expired."); } }, 1000);
        gw.querySelector("#upi-ok").onclick = () => { clearInterval(iv); processing("Confirming with your bank…", 1500, done); };
        gw.querySelector("#upi-cancel").onclick = () => { clearInterval(iv); close(); reject(); };
      } else if (pay.type === "Net banking") {
        processing(`Redirecting to ${pay.bank}…`, 1300, () => processing("Waiting for bank confirmation…", 1500, done));
      } else {
        processing("Placing your order…", 900, () => { close(); resolve(); });
      }
    });
  }

  /* ---------- place order ---------- */
  root.addEventListener("click", async (e) => {
    if (!e.target.closest("#place")) return;
    const addr = validateAddress();
    if (!addr) { toast("Please complete your delivery address", "err"); return; }
    $("st-addr").classList.replace("on", "done");
    $("st-pay").classList.add("on");
    const t = LM.totals(opts());
    const pay = validatePayment(t.grand);
    if (!pay) { document.querySelector(".pay").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    LM.address.set(addr);
    LM.pin.set(addr.pin);
    try { await runGateway(pay, t.grand); } catch { toast("Payment cancelled. You have not been charged."); return; }

    const order = LM.orders.create({
      items: t.lines.map((l) => ({ id: l.p.id, title: l.p.title, qty: l.qty, price: l.price, color: l.color, opt: l.opt })),
      address: addr,
      payment: { type: pay.type, label: pay.label, paid: pay.type !== "COD" },
      ship: state.ship,
      eta: LM.etaDays(addr.pin, state.ship === "express"),
      totals: { mrp: t.mrp, subtotal: t.subtotal, discount: t.discount, coupon: t.couponCode, couponOff: t.couponOff, shipping: t.shipping, codFee: t.codFee, platform: t.platform, grand: t.grand }
    });
    LM.cart.clear();
    location.href = "success.html?id=" + encodeURIComponent(order.id);
  });

  refresh();
});
