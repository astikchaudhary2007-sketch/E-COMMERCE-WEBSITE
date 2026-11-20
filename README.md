# Loot Market

A multi-page e-commerce storefront built with plain HTML, CSS and JavaScript. It needs no build step.

## Run it
Open `index.html` in any browser. The cart, wishlist and orders are saved in your browser's `localStorage`.

## Pages
| Page | What it does |
|---|---|
| `index.html` | Hero carousel, category tiles, deals of the day with a countdown, bestsellers, brands, recently viewed |
| `shop.html` | Listing with category, type, brand, price, rating and discount filters, sorting, search and pagination |
| `product.html?id=…` | Gallery with hover zoom, variants (colour, storage, size), offers, pincode delivery check, specs, reviews, similar items |
| `cart.html` | Quantity controls, save for later, coupons, free-delivery progress bar, price breakdown |
| `checkout.html` | Address form with validation, Standard or Express delivery, payment by card, UPI, net banking or COD |
| `success.html` | Order confirmation and printable invoice |
| `orders.html` | Order history with a tracking timeline, cancel order, buy again, search and filters |
| `wishlist.html`, `help.html` | Saved items; FAQ and contact form |

## Testing payments
The payment gateway is **simulated in the browser**:
- Card `4111 1111 1111 1111`, any future expiry date, any CVV, then any 6-digit OTP: the payment succeeds.
- Card `4000 0000 0000 0002`: the payment is declined.
- Coupons: `LOOT10`, `FIRST200`, `BIGLOOT`.

To take real payments, replace `runGateway()` in `js/pages/checkout.js` with Razorpay Checkout or Stripe, and create and verify orders on a server.

## Data
Products are in `js/data.js`. Names, MRPs and prices are modelled on Amazon.in listings, but they are a snapshot, not live prices. Product photos come from Unsplash. Book covers are generated as SVG.
