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
        $imageUrl = 'images/modeling/portfolio' . $portfolioId . '/album' . $albumId . '/photo' . $photoId . '.jpg';
        $stmt = $conn->prepare('INSERT INTO portfolio_database (portfolio_id, album_id, image_id, image_url) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE image_url=VALUES(image_url)');
        $stmt->bind_param('iiis', $portfolioId, $albumId, $photoId, $imageUrl);
        $stmt->execute();
        $stmt->close();
    }

?>
