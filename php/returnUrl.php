<?php
include 'db_connection.php';

$baseDir = '../images/modeling';

// Function to fetch the image URL based on portfolio_id and id (count)
function fetchImageData($conn, $portfolioId, $count) {
    // Prepare a SQL statement to select album_id, image_id, and image_url for the given portfolio_id and id (count)
    $stmt = $conn->prepare('SELECT album_id, image_id, image_url FROM portfolio_database WHERE portfolio_id = ? AND id = ?');
    $stmt->bind_param('ii', $portfolioId, $count);
    $stmt->execute();
    $stmt->bind_result($albumId, $imageId, $imageUrl);
    $stmt->fetch();
    $stmt->close();
    
    // Check if data was found
    if ($albumId && $imageId && $imageUrl) {
        return ['albumId' => $albumId, 'imageId' => $imageId, 'imageUrl' => $imageUrl];
    } else {
        return null;
    }
}

// Check if portfolioId and count parameters are provided
if (isset($_GET['portfolioId']) && isset($_GET['count'])) {
    $portfolioId = $_GET['portfolioId'];
    $count = $_GET['count'];

    // Fetch the image data
    $imageData = fetchImageData($conn, $portfolioId, $count);

    // Prepare the response
    if ($imageData) {
        $response = ['imageUrl' => $imageData['imageUrl']];
    } else {
        $response = ['error' => 'Image not found'];
    }
} else {
    // If required parameters are missing, return an error
    $response = ['error' => 'Missing portfolioId or count parameter'];
}

// Return the response as JSON
echo json_encode($response);

// Close the database connection
$conn->close();
?>
