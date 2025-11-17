<?php
// Paystack payment verification endpoint
// This verifies the payment with Paystack API and marks the booking as paid
header('Content-Type: application/json');

$raw = file_get_contents('php://input');
if (!$raw) {
    echo json_encode(['status'=>'error','message'=>'No data']);
    http_response_code(400);
    exit;
}

$data = json_decode($raw, true);
if (!$data || !isset($data['reference'])) {
    echo json_encode(['status'=>'error','message'=>'Invalid data']);
    http_response_code(400);
    exit;
}

$reference = $data['reference'];
$bookingId = $data['bookingId'];
$amount = $data['amount'] * 100; // convert to kobo

// Your Paystack secret key (get from https://dashboard.paystack.com)
$secretKey = 'sk_test_782c6e80b8c5c122a33074824111b53fd55ef511';

// Verify payment with Paystack API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.paystack.co/transaction/verify/' . $reference);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $secretKey]);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(['status'=>'error','message'=>'Verification request failed']);
    http_response_code(400);
    exit;
}

$response = json_decode($result, true);

// Check if payment was successful
if (isset($response['status']) && $response['status'] === true && 
    isset($response['data']['status']) && $response['data']['status'] === 'success') {
    
    // Verify amount matches
    $paidAmount = $response['data']['amount'];
    if ($paidAmount === $amount) {
        // Payment verified successfully
        error_log("Payment verified for booking {$bookingId}, reference {$reference}");
        
        // Store payment record
        $paymentRecord = [
            'bookingId' => $bookingId,
            'reference' => $reference,
            'status' => 'paid',
            'amount' => $amount / 100,
            'timestamp' => date('Y-m-d H:i:s'),
            'paystackResponse' => $response['data']
        ];
        
        // Store payment records in JSON file (demo) or database
        $paymentsFile = __DIR__ . '/../../payments.json';
        $payments = json_decode(@file_get_contents($paymentsFile) ?: '[]', true);
        $payments[] = $paymentRecord;
        file_put_contents($paymentsFile, json_encode($payments, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        
        echo json_encode(['status'=>'ok','message'=>'Payment verified and booking confirmed']);
    } else {
        echo json_encode(['status'=>'error','message'=>'Payment amount mismatch']);
        http_response_code(400);
    }
} else {
    echo json_encode(['status'=>'error','message'=>'Payment not successful']);
    http_response_code(400);
}
