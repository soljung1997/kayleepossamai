<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connection.php';
include 'add_row.php';

function addAlbum($conn, $portfolioId) {
    $portfolioDir = '../images/modeling/portfolio' . $portfolioId;

    if (!is_dir($portfolioDir)) {
        return ["status" => "error", "message" => "Directory does not exist: " . $portfolioDir];
    }

    $albumIterator = new DirectoryIterator($portfolioDir);

    foreach ($albumIterator as $album) {
        if ($album->isDir() && !$album->isDot()) {
            $albumId = intval(str_replace('album', '', $album->getFilename()));
            
            // Reset imageCount for each new album
            $imageCount = 1;
            $photoIterator = new DirectoryIterator($album->getPathname());

            foreach ($photoIterator as $photo) {
                if ($photo->isFile() && !$photo->isDot()) {
                    if (!insertData($conn, $portfolioId, $albumId, $imageCount)) {
                        return ["status" => "error", "message" => "Failed to insert data for portfolioId: $portfolioId, albumId: $albumId, imageCount: $imageCount"];
                    }
                    $imageCount++;
                }
            }
        }
    }

    return ["status" => "success", "message" => "URLs added to the database."];
}

$response = [];
if (isset($_GET['portfolioId'])) {
    $portfolioId = intval($_GET['portfolioId']);
    if ($portfolioId > 0) {
        $response = addAlbum($conn, $portfolioId);
    } else {
        $response = ["status" => "error", "message" => "Invalid portfolio ID."];
    }
} else {
    $response = ["status" => "error", "message" => "No portfolio ID provided."];
}

$conn->close();
echo json_encode($response);
?>
