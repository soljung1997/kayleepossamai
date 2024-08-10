<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include database connection
include 'db_connection.php'; // Adjust the path as necessary

function getNumberOfRows($conn, $tableName) {
    try {
        $stmt = $conn->prepare("SELECT COUNT(*) FROM $tableName");
        if ($stmt === false) {
            throw new Exception($conn->error);
        }
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
        return $count;
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Table name
$tableName = 'portfolio_database';
$count = getNumberOfRows($conn, $tableName);

// Return the count as a JSON response
if (is_array($count) && isset($count['error'])) {
    echo json_encode(['status' => 'error', 'message' => $count['error']]);
} else {
    echo json_encode(['count' => $count]);
}

$conn->close(); // Ensure to close the connection if needed
?>
