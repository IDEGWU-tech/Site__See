# PayPal Integration Setup for Site See

## Quick Setup

### 1. Get Your PayPal Sandbox Credentials
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Sign in or create an account
3. In the **Sandbox** section, create a **Business Account** (test merchant account)
4. Copy your **Client ID** (you'll see it in the dashboard)

### 2. Add Client ID to Your Frontend
- Open `index.html`
- Find this line:
  ```html
  <script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD" ...></script>
  ```
- Replace `YOUR_PAYPAL_CLIENT_ID` with your actual Client ID from step 1

### 3. Test the Payment Flow
1. Open the website in your browser
2. Fill in a booking form and click "Confirm Booking"
3. A "Proceed to Payment" section appears with a PayPal button
4. Click the button — a PayPal-hosted popup opens
5. Log in with a **Sandbox Buyer Account** (create one in the PayPal Dashboard under Accounts)
6. Confirm the payment amount and authorize
7. PayPal returns approval, and the frontend calls `/backend/php/verify_payment.php`
8. The booking is marked as paid

### 4. Backend Verification (Optional)
The `verify_payment.php` endpoint receives the order details from PayPal and:
- Logs the payment
- Stores it in `payments.json` (demo) or a database
- Returns confirmation to the frontend

For **production**, you'll want to:
- Call the PayPal API directly to verify the order status
- Use your **Client Secret** (kept server-side only, never expose in frontend)
- Store payments in a proper database

### 5. Going Live
When ready to accept real payments:
1. Switch from **Sandbox** to **Live** in the PayPal Dashboard
2. Use your **Live Client ID** instead of the sandbox one
3. Use your **Live Secret** on the backend
4. Test with small amounts first

## Files Modified
- `index.html` — Added PayPal SDK script and payment container
- `css/styles.css` — Added `.paypal-container` styling
- `js/app.js` — Added `renderPayPalButton()` and payment flow logic
- `backend/php/verify_payment.php` — Backend verification endpoint

## Notes
- The amount is calculated as `$50 per guest` (line in `app.js`)
- The booking is saved in `localStorage` before payment (so user sees it in "My Bookings")
- Payment status (`paid` or `unpaid`) is tracked locally
- You can customize the amount, currency, or add promotional pricing
