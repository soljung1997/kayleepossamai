<?php

function getNumberOfRows($conn, $tableName) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM $tableName");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Prepare statement failed: " . $conn->error]);
        return false;
    }
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    return $count;
}

// Function to insert data into the database
function insertData($conn, $portfolioId, $albumId, $photoId) {
    // Construct the image URL
    $imageUrl = '../images/modeling/portfolio' . $portfolioId . '/album' . $albumId . '/photo' . $photoId . '.jpg';
    
    // Prepare the SQL statement with ON DUPLICATE KEY UPDATE
    $stmt = $conn->prepare('INSERT INTO portfolio_database (portfolio_id, album_id, image_id, image_url) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE image_url=VALUES(image_url)');
    
    // Check if the prepare statement was successful
    if (!$stmt) {
        error_log("Prepare statement failed: " . $conn->error);
        return false;
    }

    // Bind the parameters to the SQL query
    $stmt->bind_param('iiis', $portfolioId, $albumId, $photoId, $imageUrl);
    
    // Execute the statement and check if it was successful
    if (!$stmt->execute()) {
        error_log("Execute failed: " . $stmt->error);
        return false;
    }
    
    // Close the statement
    $stmt->close();
    return true;
}


?>
