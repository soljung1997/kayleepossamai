<?php

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connection.php';
include 'add_row.php';

// Function to check if the table is empty
function isTableEmpty($conn, $tableName) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM $tableName");
    if (!$stmt) {
        return ["status" => "error", "message" => "Failed to check table count: " . $conn->error];
    }
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    return $count === 0;
}

// Function to reset AUTO_INCREMENT if necessary
function resetAutoIncrement($conn, $tableName) {
    $stmt = $conn->prepare("ALTER TABLE $tableName AUTO_INCREMENT = 1");
    if (!$stmt) {
        return ["status" => "error", "message" => "Failed to reset AUTO_INCREMENT: " . $conn->error];
    }
    if (!$stmt->execute()) {
        return ["status" => "error", "message" => "Failed to execute AUTO_INCREMENT reset: " . $stmt->error];
    }
    $stmt->close();
    return ["status" => "success"];
}

// Function to add album data to the database
function addAlbum($conn, $portfolioId) {
    $portfolioDir = '../images/modeling/portfolio' . $portfolioId;

    if (!is_dir($portfolioDir)) {
        return ["status" => "error", "message" => "Directory does not exist: " . $portfolioDir];
    }

    // Check if the table is empty and reset AUTO_INCREMENT if it is
    if (isTableEmpty($conn, 'portfolio_database')) {
        $resetResult = resetAutoIncrement($conn, 'portfolio_database');
        if ($resetResult['status'] !== 'success') {
            return $resetResult;
        }
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
                    // Use the updated insertData function that checks for duplicates
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
