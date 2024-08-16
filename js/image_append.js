$(document).ready(function() {
    const portfolioId = $('body').data('portfolio-id'); // Get the portfolio ID from the HTML data attribute

    // Throttle function to limit how often a function can be executed
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Function to fetch image URLs and update the gallery
    function fetchAndDisplayImages(portfolioId) {
        let currentId = 0; // Initialize currentId here
        let lastMouseX = 0;
        let scrollSpeed = 0;
        let scrollingDirection = 0;
        let isScrolling = false;
        const friction = 0.98; // Friction factor to simulate gradual slowdown
        const scrollSpeedFactor = 0.5; // Speed factor for scrolling

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

                // Function to handle mouse movement
                function handleMouseMove(e) {
                    const container = document.querySelector('#portfolioContainer');
                    const rect = container.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left; // Mouse position within the container
                    const deltaX = mouseX - lastMouseX;

                    if (lastMouseX !== 0) {
                        scrollSpeed = Math.abs(deltaX) * scrollSpeedFactor;
                        scrollingDirection = deltaX > 0 ? 1 : -1;
                        isScrolling = true;

                        // Debug logs
                        console.log(`MouseX: ${mouseX}, LastMouseX: ${lastMouseX}, DeltaX: ${deltaX}`);
                        console.log(`ScrollSpeed: ${scrollSpeed}, ScrollingDirection: ${scrollingDirection}`);
                    }

                    lastMouseX = mouseX;
                }

                // Function to handle mouse leaving the container
                function handleMouseLeave() {
                    isScrolling = false; // Stop scrolling
                    scrollSpeed = 0; // Reset scroll speed
                }

                // Throttled mouse move
                const throttledMouseMove = throttle(handleMouseMove, 50); // Throttle to run every 50ms

                function continueScrolling() {
                    if (isScrolling) {
                        const container = document.querySelector('#portfolioContainer');
                        container.scrollLeft += scrollSpeed * scrollingDirection; // Scroll based on speed and direction

                        // Gradually reduce speed to simulate friction
                        scrollSpeed *= friction;

                        // Debug log
                        console.log(`Container ScrollLeft: ${container.scrollLeft}, ScrollSpeed: ${scrollSpeed}`);

                        if (scrollSpeed < 0.1) {
                            scrollSpeed = 0;
                            isScrolling = false; // Stop scrolling when speed is minimal
                        }
                    }
                }

                function initializeHoverScrolling() {
                    const container = document.querySelector('#portfolioContainer');
                    container.addEventListener('mousemove', throttledMouseMove);
                    container.addEventListener('mouseleave', handleMouseLeave); // Handle mouse leave
                    setInterval(continueScrolling, 20); // Periodically continue scrolling
                }

                // Function to fetch and display the next image
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
                                return;  // Exit if no more images are found
                            }

                            console.log(`Fetched URL for image ID ${currentId}:`, response);
                            const imageUrl = response.imageUrl;

                            // Append the image to the portfolio container
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

                // Start fetching images
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
