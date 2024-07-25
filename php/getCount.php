<?php
// Include database connection

function getNumberOfRows($conn, $tableName) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM $tableName");
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    return $count;
}

    // Table name
    $tableName = 'portfolio_database';
    $count = getNumberOfRows($conn, $tableName);

    // Return the count as a JSON response
    echo json_encode(['count' => $count]);
?>