<?php
// backend/db_connect.php
$servername = "localhost"; // Your database server, usually 'localhost'
$username = "root"; // <--- CHANGE THIS to your database username (as you suspected for 'root')
$password = "Zeel@1234"; // <--- CHANGE THIS to your database password (as you provided)
$dbname = "subscription_management"; // <--- CHANGE THIS to your database name (as you provided)

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// Start session if not already started (Good practice to put this here or in config.php)
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>