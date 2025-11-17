# Paystack Integration Setup for Site See

## Step 1: Create a Paystack Account

1. Go to [Paystack.com](https://paystack.com) and click **Sign up**
2. Fill in your details (email, password, business name)
3. Verify your email address
4. Complete your business information (you'll be asked for country, business type, etc.)
5. Once verified, you'll have access to your Paystack Dashboard

## Step 2: Get Your API Keys

1. Log in to [Paystack Dashboard](https://dashboard.paystack.com)
2. Go to **Settings** → **API Keys & Webhooks**
3. You'll see two tabs: **Test** and **Live**
   - **Test** is for development/testing
   - **Live** is for real payments (use after going live)
4. Copy your **Public Key** (starts with `pk_test_` or `pk_live_`)
5. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 3: Update Your Site See Code

### Add Public Key to Frontend
1. Open `index.html`
2. Find this line:
   ```html
   <script>window.PAYSTACK_PUBLIC_KEY = 'YOUR_PAYSTACK_PUBLIC_KEY';</script>
   ```
3. Replace `YOUR_PAYSTACK_PUBLIC_KEY` with your **Public Key** from step 2

### Add Secret Key to Backend
1. Open `backend/php/verify_paystack.php`
2. Find this line:
   ```php
   $secretKey = 'YOUR_PAYSTACK_SECRET_KEY';
   ```
3. Replace `YOUR_PAYSTACK_SECRET_KEY` with your **Secret Key** from step 2

## Step 4: Test the Payment

1. Open your Site See website in a browser
2. Fill in a booking and click "Confirm Booking"
3. A "Pay with Paystack" button appears
4. Click the button — a Paystack payment form opens
5. Use these **test card details**:
   - **Card Number**: `4084084084084081`
   - **Expiry**: Any future date (e.g., 12/25)
   - **CVV**: `408`
   - **Amount**: Will be auto-filled
6. Click **Pay** — payment should complete
7. You'll see a confirmation message

## Step 5: Verify Payment in Dashboard

1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Click **Transactions**
3. You should see your test payment listed
4. Click it to view details

## Going Live

When ready to accept real payments:

1. Complete your Paystack business verification (KYC)
2. Switch to **Live** keys in the Paystack Dashboard
3. Update your code with **Live** Public and Secret keys
4. Test with a small real transaction first
5. Funds will settle to your linked bank account

## Troubleshooting

- **"SDK not loaded" error**: Make sure the Paystack script is loading correctly. Check your internet connection.
- **"Key not set" error**: Verify you've added your Public Key to `index.html`
- **Payment fails**: Use the test card above; ensure the amount is a valid integer (no decimals in Naira)
- **Verification fails**: Check that your Secret Key is correct in `verify_paystack.php`

## Support

- [Paystack Documentation](https://paystack.com/docs)
- [Paystack Support](https://paystack.com/support)
- Email Paystack at: support@paystack.com

---

**Current Setup**: Site See charges ₦5,000 per guest. Modify this in `js/app.js` (search for `5000`).
