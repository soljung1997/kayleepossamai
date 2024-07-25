<?php
include 'db_connection.php';
include 'add_row.php';

function getNumberOfRows($conn, $tableName) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM $tableName");
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    return $count;
}

function addAlbum($conn, $portfolioId) {
    $portfolioDir = 'images/modeling/portfolio' . $portfolioId;
    $imageCount = getNumberOfRows($conn, 'image_table') + 1; // Increment by 1 for the new photo

    if (is_dir($portfolioDir)) {
        $albumIterator = new DirectoryIterator($portfolioDir);

        foreach ($albumIterator as $album) {
            if ($album->isDir() && !$album->isDot()) {
                $albumId = intval(str_replace('album', '', $album->getFilename()));
                $photoIterator = new DirectoryIterator($album->getPathname());

                foreach ($photoIterator as $photo) {
                    if ($photo->isFile() && !$photo->isDot()) {
                        if (insertData($conn, $portfolioId, $albumId, $imageCount)) {
                            echo "Inserted data for portfolioId: $portfolioId, albumId: $albumId, imageCount: $imageCount\n";
                        } else {
                            echo "Failed to insert data for portfolioId: $portfolioId, albumId: $albumId, imageCount: $imageCount\n";
                        }
                        $imageCount++;
                    }
                }
            }
        }
    } else {
        echo "The portfolio directory does not exist.";
    }
}

if (isset($_GET['portfolioId'])) {
    $portfolioId = intval($_GET['portfolioId']); // Get the portfolio ID from the AJAX request
    echo "Received portfolio ID: $portfolioId\n"; // Debugging statement
    addAlbum($conn, $portfolioId);
} else {
    echo "No portfolio ID provided.";
}

$conn->close();

?>
