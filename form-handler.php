<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Basic validation (optional)
    if (empty($name) || empty($email) || empty($message)) {
        echo "All fields are required.";
        exit;
    }

    // Send an email (this is a basic example, adjust as needed)
    $to = "booking.kaylee@gmail.com"; // Replace with your email address
    $subject = "New contact form submission";
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "Thank you for contacting me. I will get back to you soon.";
    } else {
        echo "There was an error sending your message. Please try again later.";
    }
} else {
    echo "Invalid request.";
}
?>
