<?php
// get_subscriptions.php
include 'db_connect.php';
session_start();

header('Content-Type: application/json');

$response = ['success' => false, 'subscriptions' => [], 'message' => ''];

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'Unauthorized. Please log in.';
    echo json_encode($response);
    exit();
}

$user_id = $_SESSION['user_id'];
$subscription_id = $_GET['id'] ?? null; // Check if a single subscription ID is requested
$filter_status = $_GET['status'] ?? 'all';
$search_term = $_GET['search'] ?? '';

$sql = "SELECT id, user_id, plan_name, start_date, end_date, status, amount FROM subscriptions WHERE user_id = ?";
$params = [$user_id];
$types = "i";

if ($subscription_id !== null) {
    // Fetch a single subscription by ID
    $sql .= " AND id = ?";
    $params[] = $subscription_id;
    $types .= "i";
} else {
    // Apply filters and search for multiple subscriptions
    if ($filter_status !== 'all') {
        $sql .= " AND status = ?";
        $params[] = $filter_status;
        $types .= "s";
    }

    if (!empty($search_term)) {
        $sql .= " AND (plan_name LIKE ? OR status LIKE ?)";
        $search_param = '%' . $search_term . '%';
        $params[] = $search_param;
        $params[] = $search_param;
        $types .= "ss";
    }

    $sql .= " ORDER BY start_date DESC";
}

$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $subscriptions = [];
    while ($row = $result->fetch_assoc()) {
        $subscriptions[] = $row;
    }
    $response['success'] = true;
    $response['subscriptions'] = $subscriptions;
    $stmt->close();
} else {
    $response['message'] = 'Failed to prepare statement: ' . $conn->error;
}

$conn->close();
echo json_encode($response);
?>