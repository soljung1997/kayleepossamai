$(document).ready(function() {
    const portfolioId = $('body').data('portfolio-id'); // Get the portfolio ID from the HTML data attribute

    // Function to fetch image URLs and update the gallery
    function fetchAndDisplayImages(portfolioId) {
        let currentId;

        // Get the first ID for this portfolio_id
        $.ajax({
            url: '../php/getCount.php',  // PHP script to get the first ID for the portfolio (from getCount.php)
            method: 'GET',
            data: { portfolioId: portfolioId },
            dataType: 'json',
            success: function(data) {
                currentId = data.first_id;  // Start with the first ID

                if (currentId === undefined) {
                    console.log('No images found in the database.');
                    $('#galleryContainer').append('<p>No images found in the database.</p>');
                    return;
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
                        
                            // Extract albumId from imageUrl
                            const albumIdMatch = imageUrl.match(/album(\d+)\//);
                            if (albumIdMatch) {
                                const albumId = albumIdMatch[1];
                        
                                // Check if the album div already exists, if not create it
                                if ($('#album' + albumId).length === 0) {
                                    $('#galleryContainer').append('<div id="album' + albumId + '" class="album-portfolio">' + '</div>');
                                }
                        
                                // Check if the portfolio-container div exists, if not create it
                                if ($('#album' + albumId + ' .portfolio-container').length === 0) {
                                    $('#album' + albumId).append('<div class="portfolio-container"></div>');
                                }
                        
                                // Append the image to the respective portfolio-container div
                                $('#album' + albumId + ' .portfolio-container').append('<img src="' + imageUrl + '" alt="Image ' + currentId + '" class="portfolio-image">');
                            }
                        
                            // Increment the current ID and continue the loop
                            currentId++;
                            fetchNextImage();  // Recursively call to fetch the next image
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
