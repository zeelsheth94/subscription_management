<?php
// backend/login.php
include 'db_connect.php';
session_start();

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $response['message'] = 'Username and password are required.';
        echo json_encode($response);
        exit();
    }

    // MODIFICATION: Changed 'password' to 'password_hash' in SELECT
    $stmt = $conn->prepare("SELECT id, username, password_hash FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($user_id, $db_username, $hashed_password);
    $stmt->fetch();

    if ($stmt->num_rows > 0 && password_verify($password, $hashed_password)) {
        // Login successful
        session_regenerate_id(true); // Recommended for security
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $db_username;
        $response['success'] = true;
        $response['message'] = 'Login successful!';
    } else {
        $response['message'] = 'Invalid username or password.';
    }
    $stmt->close();
} else {
    $response['message'] = 'Invalid request method.';
}

$conn->close();
echo json_encode($response);
?>