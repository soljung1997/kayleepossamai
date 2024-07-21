<?php
    include 'db_connection.php';

    function getNumberOfRows($conn, $tableName) {
        $stmt = $conn->prepare("SELECT COUNT(*) FROM $tableName");
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
        return $count;
    }

    $imageCount = getNumberOfRows($conn, 'image_table') + 1; // Increment by 1 for the new photo

    // Function to insert data into the database
    function insertData($conn, $portfolioId, $albumId, $photoId) {
        $imageUrl = 'images/modeling/portfolio' . $portfolioId . '/album' . $albumId . '/photo' . $photoId . '.jpg';
        $stmt = $conn->prepare('INSERT INTO image_table (portfolio_id, album_id, photo_id, image_url) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE image_url=VALUES(image_url)');
        $stmt->bind_param('iiis', $portfolioId, $albumId, $photoId, $imageUrl);
        $stmt->execute();
        $stmt->close();
    }

    $conn->close();
?>
