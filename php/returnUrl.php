<?php
include 'db_connection.php';

$baseDir = 'images/modeling';

// Function to get album_id for a given id
function getAlbumId($conn, $id) {
    $stmt = $conn->prepare('SELECT album_id FROM portfolio_database WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->bind_result($albumId);
    $stmt->fetch();
    $stmt->close();
    return $albumId;
}

// Function to get photo_id for a given id
function getPhotoId($conn, $id) {
    $stmt = $conn->prepare('SELECT photo_id FROM portfolio_database WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->bind_result($photoId);
    $stmt->fetch();
    $stmt->close();
    return $photoId;
}


//returns the url based on the count given by the js
function returnUrl($conn, $tableName, $portfolioId, $count){
    // Loop through portfolios, albums, and photos, and appends them to js
    $albumId = getAlbumId($conn, $count);
    $photoId = getPhotoId($conn, $count);
    $imageUrl = "photos/portfolio$portfolioId/album$albumId/photo$photoId.jpg";
    return $imageUrl;
}


$conn->close();
?>
