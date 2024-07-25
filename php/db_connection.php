<?php
$servername = "localhost";
$username = "u948638503_kayleepossamai";
$password = "K@yl33123";
$dbname = "u948638503_database";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}else{
    echo "Connected Successfully!";
}

?>
