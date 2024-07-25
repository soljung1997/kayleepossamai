$(document).ready(function() {
    const portfolioId = $('body').data('portfolio-id'); // Get the portfolio ID from the HTML data attribute

    // Function to fetch image URLs and update the gallery
    function fetchAndDisplayImages(count, portfolioId) {
        if (count === 0) {
            console.log('The database is empty.');
            $('#galleryContainer').append('<p>No images found in the database.</p>');
            return;
        }

        for (let i = 1; i <= count; i++) {
            $.ajax({
                url: '../php/returnUrl.php',  // Relative path to the PHP file
                method: 'GET',
                data: {
                    portfolioId: portfolioId,
                    count: i
                },
                dataType: 'json',
                success: function(response) {
                    console.log(`Fetched URL for image ${i}:`, response);
                    const imageUrl = response.imageUrl;

                    // Extract albumId from imageUrl
                    const albumIdMatch = imageUrl.match(/album(\d+)\//);
                    if (albumIdMatch) {
                        const albumId = albumIdMatch[1];

                        // Check if the album div already exists, if not create it
                        if ($('#album' + albumId).length === 0) {
                            $('#galleryContainer').append('<div id="album' + albumId + '" class="album">Album ' + albumId + '</div>');
                        }

                        // Append the image to the respective album div
                        $('#album' + albumId).append('<img src="' + imageUrl + '" alt="Image ' + i + '">');
                    }
                },
                error: function(xhr, status, error) {
                    if (xhr.status === 0) {
                        console.error('CORS error or network issue. Please make sure you are running this on a server.');
                    } else {
                        console.error(`Error fetching URL for image ${i}:`, error);
                    }
                }
            });
        }
    }

    // First call add_urls.php to add new URLs to the database
    $.ajax({
        url: '../php/append_urls.php',  // Relative path to the PHP file
        method: 'GET',
        data: { portfolioId: portfolioId },
        dataType: 'json',  // Expect JSON response
        success: function(response) {
            console.log('append_urls.php response:', response);
            if (response.status === 'success') {
                // Fetch the number of images after updating the database
                $.ajax({
                    url: '../php/getCount.php',  // Relative path to the PHP file
                    method: 'GET',
                    data: { portfolioId: portfolioId },
                    dataType: 'json',
                    success: function(data) {
                        const count = data.count;
                        console.log('Image count:', count);
                        fetchAndDisplayImages(count, portfolioId);
                    },
                    error: function(xhr, status, error) {
                        if (xhr.status === 0) {
                            console.error('CORS error or network issue. Please make sure you are running this on a server.');
                        } else {
                            console.error('Error fetching image count:', error);
                        }
                    }
                });
            } else {
                console.error('Error adding URLs:', response.message);
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 0) {
                console.error('CORS error or network issue. Please make sure you are running this on a server.');
            } else {
                console.error('Error calling add_urls.php:', error);
            }
        }
    });
});
