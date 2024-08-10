<?php
include 'db_connection.php';

$baseDir = '../images/modeling';

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

// Function to get image_id for a given id
function getPhotoId($conn, $id) {
    $stmt = $conn->prepare('SELECT image_id FROM portfolio_database WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->bind_result($photoId);
    $stmt->fetch();
    $stmt->close();
    return $photoId;
}

// Function to return the image URL based on the count
function returnUrl($conn, $tableName, $portfolioId, $count, $baseDir){
    // Fetch album and photo IDs
    $albumId = getAlbumId($conn, $count);
    $photoId = getPhotoId($conn, $count);
    
    // Construct the image URL
    $imageUrl = "$baseDir/portfolio$portfolioId/album$albumId/photo$photoId.jpg";
    
    return $imageUrl;
}

// Assuming you're getting the correct data and returning it in JSON format
$response = ['imageUrl' => returnUrl($conn, 'portfolio_database', $_GET['portfolioId'], $_GET['count'], $baseDir)];
echo json_encode($response);

$conn->close();
?>
