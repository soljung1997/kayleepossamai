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

$(document).ready(function() {
    const portfolioId = $('body').data('portfolio-id'); // Get the portfolio ID from the HTML data attribute

    let lastMouseX = null;
    let isMouseMoving = false;
    let scrollSpeed = 10;

    // Handle mouse movement
    function handleMouseMove(e) {
        const container = document.querySelector('#portfolioContainer');
        const rect = container.getBoundingClientRect();
        const reference = document.querySelector('body');
        const reference_rect = reference.getBoundingClientRect();
        const containerWidth = reference_rect.width;
        const mouseX = e.clientX - rect.left; // Mouse position within the container
        lastMouseX = mouseX;
        isMouseMoving = true;
    }

    // Update scrolling based on last mouse position
    function updateScroll() {
        const container = document.querySelector('#portfolioContainer');
        if (lastMouseX !== null) {
            const rect = container.getBoundingClientRect();
            const reference = document.querySelector('body');
            const reference_rect = reference.getBoundingClientRect();
            const containerWidth = reference_rect.width;
            const centerX = containerWidth / 2;
            const mouseX = lastMouseX;
            let scrollAmount = 0;

            if (mouseX < centerX) {
                scrollAmount = (centerX - mouseX) / centerX * scrollSpeed;
                container.scrollLeft -= scrollAmount;
            } else {
                scrollAmount = (mouseX - centerX) / centerX * scrollSpeed;
                container.scrollLeft += scrollAmount;
            }

            requestAnimationFrame(updateScroll);
        } else if (isMouseMoving) {
            requestAnimationFrame(updateScroll);
        }
    }

    const throttledMouseMove = throttle(handleMouseMove, 50); // Throttle to run every 50ms

    function initializeHoverScrolling() {
        const container = document.querySelector('#portfolioContainer');

        container.addEventListener('mousemove', throttledMouseMove);

        container.addEventListener('mouseleave', function() {
            container.scrollLeft = 0;
            lastMouseX = null;
            isMouseMoving = false;
        });

        requestAnimationFrame(updateScroll);
    }

    function fetchAndDisplayImages(portfolioId) {
        let currentId;

        $.ajax({
            url: '../php/getCount.php',
            method: 'GET',
            data: { portfolioId: portfolioId },
            dataType: 'json',
            success: function(data) {
                currentId = data.first_id;

                if (currentId === undefined) {
                    console.log('No images found in the database.');
                    $('#portfolioContainer').append('<p>No images found in the database.</p>');
                    return;
                }

                function fetchNextImage() {
                    $.ajax({
                        url: '../php/returnUrl.php',
                        method: 'GET',
                        data: {
                            portfolioId: portfolioId,
                            count: currentId
                        },
                        dataType: 'json',
                        success: function(response) {
                            if (response.error) {
                                console.log(`No more images found for portfolio ${portfolioId}.`);
                                return;
                            }

                            console.log(`Fetched URL for image ID ${currentId}:`, response);
                            const imageUrl = response.imageUrl;

                            $('#portfolioContainer').append('<img src="' + imageUrl + '" alt="Image ' + currentId + '" class="portfolio-image">');

                            currentId++;
                            fetchNextImage();

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

    $.ajax({
        url: '../php/append_urls.php',
        method: 'GET',
        data: { portfolioId: portfolioId },
        dataType: 'json',
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
