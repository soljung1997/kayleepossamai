$(document).ready(function() {
    const portfolioId = $('body').data('portfolio-id'); // Get the portfolio ID from the HTML data attribute

    // Function to fetch image URLs and update the gallery
    function fetchAndDisplayImages(portfolioId) {
        let currentId;

        // Get the first ID for this portfolio_id
        $.ajax({
            url: '../php/getCount.php',  // PHP script to get the first ID for the portfolio
            method: 'GET',
            data: { portfolioId: portfolioId },
            dataType: 'json',
            success: function(data) {
                currentId = data.first_id;  // Start with the first ID

                if (currentId === undefined) {
                    console.log('No images found in the database.');
                    $('#portfolioContainer').append('<p>No images found in the database.</p>');
                    return;
                }

                // Function to initialize hover-based scrolling
                function initializeHoverScrolling() {
                    const container = document.querySelector('#portfolioScreen');
                    const container_scroll = document.querySelector('#portfolioContainer');

                    container.addEventListener('mousemove', function(e) {
                        const rect = container.getBoundingClientRect();
                        const containerWidth = rect.width;
                        const mouseX = e.clientX - rect.left; // Mouse position within the container
                        const centerX = containerWidth / 2; // Center of the container
                        const maxScrollLeft = container.scrollWidth - container.clientWidth;
                        const scrollSpeed = 0.2; // Adjust scroll speed as needed

                        // Calculate scroll amount based on mouse position
                        let scrollAmount = 0;
                        if (mouseX < centerX) {
                            // Mouse is to the left of the center
                            scrollAmount = (centerX - mouseX) / centerX * scrollSpeed;
                        } else {
                            // Mouse is to the right of the center
                            scrollAmount = (mouseX - centerX) / centerX * scrollSpeed;
                        }

                        // Update scroll position
                        container_scroll.scrollLeft -= scrollAmount; // Scroll left for mouse on left side, right for mouse on right side
                    });

                    // Optional: Reset scroll position when mouse leaves
                    container.addEventListener('mouseleave', function() {
                        container_scroll.scrollLeft = 0;
                    });
                }

                // While loop to fetch and display images for the current portfolio
                function fetchNextImage() {
                    $.ajax({
                        url: '../php/returnUrl.php',  // Relative path to the PHP file
                        method: 'GET',
                        data: {
                            portfolioId: portfolioId,
                            count: currentId  // Use the actual ID
                        },
                        dataType: 'json',
                        success: function(response) {
                            if (response.error) {
                                console.log(`No more images found for portfolio ${portfolioId}.`);
                                return;  // Exit the loop if no more images are found
                            }

                            console.log(`Fetched URL for image ID ${currentId}:`, response);
                            const imageUrl = response.imageUrl;

                            // Append the image to the single portfolio-container
                            $('#portfolioContainer').append('<img src="' + imageUrl + '" alt="Image ' + currentId + '" class="portfolio-image">');

                            // Increment the current ID and continue the loop
                            currentId++;
                            fetchNextImage();  // Recursively call to fetch the next image

                            // Initialize hover-based scrolling after the image is appended
                            initializeHoverScrolling();
                        },                        
                        error: function(xhr, status, error) {
                            if (xhr.status === 0) {
                                console.error('CORS error or network issue. Please make sure you are running this on a server.');
                            } else {
                                console.error(`Error fetching URL for image ID ${currentId}:`, error);
                                console.error('Response:', xhr.responseText);
                            }
                        }
                    });
                }

                // Start the while loop
                fetchNextImage();
            },
            error: function(xhr, status, error) {
                if (xhr.status === 0) {
                    console.error('CORS error or network issue. Please make sure you are running this on a server.');
                } else {
                    console.error('Error fetching first ID:', error);
                    console.error('Response:', xhr.responseText);
                }
            }
        });
    }

    // First call append_urls.php to add new URLs to the database
    $.ajax({
        url: '../php/append_urls.php',  // Relative path to the PHP file
        method: 'GET',
        data: { portfolioId: portfolioId },
        dataType: 'json',  // Expect JSON response
        success: function(response) {
            console.log('append_urls.php response:', response);
            if (response.status === 'success') {
                fetchAndDisplayImages(portfolioId);
            } else {
                console.error('Error adding URLs:', response.message);
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 0) {
                console.error('CORS error or network issue. Please make sure you are running this on a server.');
            } else {
                console.error('Error calling append_urls.php:', error);
                console.error('Status:', status);
                console.error('Response:', xhr.responseText);
            }
        }
    });
});
