<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include database connection
include 'db_connection.php'; // Adjust the path as necessary

function getFirstId($conn, $portfolioId) {
    try {
        // Prepare a SQL statement to select the first id for the given portfolio_id
        $stmt = $conn->prepare("SELECT MIN(id) AS first_id FROM portfolio_database WHERE portfolio_id = ?");
        if ($stmt === false) {
            throw new Exception($conn->error);
        }
        $stmt->bind_param('i', $portfolioId);
        $stmt->execute();
        $stmt->bind_result($firstId);
        $stmt->fetch();
        $stmt->close();

        // Return the first id
        if ($firstId !== null) {
            return $firstId;
        } else {
            return null; // No ID found
        }
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Check if portfolioId is provided
if (isset($_GET['portfolioId'])) {
    $portfolioId = $_GET['portfolioId'];

    $firstId = getFirstId($conn, $portfolioId);

    // Return the first ID as a JSON response
    if (is_array($firstId) && isset($firstId['error'])) {
        echo json_encode(['status' => 'error', 'message' => $firstId['error']]);
    } elseif ($firstId !== null) {
        echo json_encode(['first_id' => $firstId]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No images found for this portfolio.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'portfolioId parameter is missing']);
}

$conn->close(); // Ensure to close the connection if needed
?>
