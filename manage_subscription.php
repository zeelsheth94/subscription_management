<?php
// backend/manage_subscription.php
include 'db_connect.php';
session_start();

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'Unauthorized. Please log in.';
    echo json_encode($response);
    exit();
}

$user_id = $_SESSION['user_id'];
$action = $_POST['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'add') {
        $plan_name = $_POST['planName'] ?? '';
        $start_date = $_POST['startDate'] ?? '';
        $end_date = $_POST['endDate'] ?? null; // Can be null
        $status = $_POST['status'] ?? '';
        $amount = $_POST['amount'] ?? null; // Can be null

        if (empty($plan_name) || empty($start_date) || empty($status)) {
            $response['message'] = 'Plan Name, Start Date, and Status are required.';
            echo json_encode($response);
            exit();
        }

        $stmt = $conn->prepare("INSERT INTO subscriptions (user_id, plan_name, start_date, end_date, status, amount) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issssd", $user_id, $plan_name, $start_date, $end_date, $status, $amount);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Subscription added successfully!';
        } else {
            $response['message'] = 'Error adding subscription: ' . $stmt->error;
        }
        $stmt->close();

    } elseif ($action === 'edit') {
        $subscription_id = $_POST['id'] ?? '';
        $plan_name = $_POST['planName'] ?? '';
        $start_date = $_POST['startDate'] ?? '';
        $end_date = $_POST['endDate'] ?? null;
        $status = $_POST['status'] ?? '';
        $amount = $_POST['amount'] ?? null;

        if (empty($subscription_id) || empty($plan_name) || empty($start_date) || empty($status)) {
            $response['message'] = 'All fields are required for editing.';
            echo json_encode($response);
            exit();
        }

        // Ensure the user owns this subscription
        $stmt = $conn->prepare("UPDATE subscriptions SET plan_name = ?, start_date = ?, end_date = ?, status = ?, amount = ? WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ssssdii", $plan_name, $start_date, $end_date, $status, $amount, $subscription_id, $user_id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $response['success'] = true;
                $response['message'] = 'Subscription updated successfully!';
            } else {
                $response['message'] = 'No changes made or subscription not found/owned by user.';
            }
        } else {
            $response['message'] = 'Error updating subscription: ' . $stmt->error;
        }
        $stmt->close();

    } elseif ($action === 'delete') {
        $subscription_id = $_POST['id'] ?? '';

        if (empty($subscription_id)) {
            $response['message'] = 'Subscription ID is required for deletion.';
            echo json_encode($response);
            exit();
        }

        // Ensure the user owns this subscription before deleting
        $stmt = $conn->prepare("DELETE FROM subscriptions WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $subscription_id, $user_id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $response['success'] = true;
                $response['message'] = 'Subscription deleted successfully!';
            } else {
                $response['message'] = 'Subscription not found or not owned by user.';
            }
        } else {
            $response['message'] = 'Error deleting subscription: ' . $stmt->error;
        }
        $stmt->close();

    } else {
        $response['message'] = 'Invalid action.';
    }
} else {
    $response['message'] = 'Invalid request method.';
}

$conn->close();
echo json_encode($response);
?>