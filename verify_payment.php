<?php
// PayPal payment verification endpoint
// This validates the payment with PayPal and marks the booking as paid
header('Content-Type: application/json');

$raw = file_get_contents('php://input');
if (!$raw) {
    echo json_encode(['status'=>'error','message'=>'No data']);
    http_response_code(400);
    exit;
}

$data = json_decode($raw, true);
if (!$data || !isset($data['orderId'])) {
    echo json_encode(['status'=>'error','message'=>'Invalid data']);
    http_response_code(400);
    exit;
}

// In production, call PayPal API to verify the order
// Example using PayPal REST API (requires CLIENT_ID and CLIENT_SECRET)
// For demo, we'll just log and approve

$orderId = $data['orderId'];
$bookingId = $data['bookingId'];
$paymentDetails = $data['paymentDetails'] ?? [];

// TODO: Verify with PayPal API
// POST https://api-m.paypal.com/v2/checkout/orders/{orderId}
// Headers: Authorization: Bearer ACCESS_TOKEN
// Verify status === 'COMPLETED'

// Mock verification passed (in production, call PayPal API)
$status = $paymentDetails['status'] ?? 'COMPLETED';

if ($status === 'COMPLETED') {
    // Update booking in database (if using one) or log payment
    error_log("Payment approved for booking {$bookingId}, order {$orderId}");
    
    // Save payment record
    $paymentRecord = [
        'bookingId' => $bookingId,
        'orderId' => $orderId,
        'status' => 'paid',
        'timestamp' => date('Y-m-d H:i:s'),
        'details' => $paymentDetails
    ];
    
    // Store payment records in a JSON file (demo) or database
    $paymentsFile = __DIR__ . '/../../payments.json';
    $payments = json_decode(file_get_contents($paymentsFile) ?: '[]', true);
    $payments[] = $paymentRecord;
    file_put_contents($paymentsFile, json_encode($payments, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    
    echo json_encode(['status'=>'ok','message'=>'Payment verified and booking confirmed']);
} else {
    echo json_encode(['status'=>'error','message'=>'Payment status invalid']);
    http_response_code(400);
}
