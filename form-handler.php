<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Basic validation (optional)
    if (empty($name) || empty($email) || empty($message)) {
        $response = "All fields are required.";
    } else {
        // Send an email (this is a basic example, adjust as needed)
        $to = "booking.kaylee@gmail.com"; // Replace with your email address
        $subject = "New contact form submission";
        $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
        $headers = "From: $email";

        if (mail($to, $subject, $body, $headers)) {
            $response = "Thank you for contacting me. I will get back to you soon.";
        } else {
            $response = "There was an error sending your message. Please try again later.";
        }
    }
} else {
    $response = "Invalid request.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Submission Response</title>
    <style>
        body, html {
            width: 100%;
            height: 100%;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #000;
            color: white;
            font-family: "modernsans", sans-serif;
        }
        .popup {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: #1a1a1a;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            text-align: center;
            z-index: 1000;
            width: 80%;
            max-width: 500px;
        }
        .overlay {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }
        .close-btn {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'primer', sans-serif;
        }
        .close-btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="overlay"></div>
    <div class="popup">
        <p><?php echo $response; ?></p>
        <button class="close-btn" onclick="closePopup()">Close</button>
    </div>

    <script>
        function closePopup() {
            window.location.href = "index.html";
        }
    </script>
</body>
</html>
