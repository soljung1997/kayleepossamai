document.addEventListener("DOMContentLoaded", function() {
    // Select all portfolio-container elements within album-portfolio, which are inside the gallery
    const containers = document.querySelectorAll('.gallery .album-portfolio .portfolio-container');

    if (containers.length === 0) {
        console.error('No portfolio containers found!');
        return;
    }

    containers.forEach(container => {
        console.log('Adding scroll listeners to container:', container);

        // Horizontal scrolling with mouse wheel
        container.addEventListener('wheel', function(e) {
            console.log('Mouse wheel detected');
            e.preventDefault(); // Prevent default vertical scrolling
            container.scrollLeft += e.deltaY; // Scroll horizontally
        });

        // Variables for dragging
        let isDown = false;
        let startX;
        let scrollLeft;

        // Mouse down event
        container.addEventListener('mousedown', (e) => {
            console.log('Mouse down event');
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            container.style.cursor = "grabbing"; // Change cursor to grabbing during drag
        });

        // Mouse leave event
        container.addEventListener('mouseleave', () => {
            console.log('Mouse leave event');
            isDown = false;
            container.style.cursor = "grab"; // Revert cursor after drag
        });

        // Mouse up event
        container.addEventListener('mouseup', () => {
            console.log('Mouse up event');
            isDown = false;
            container.style.cursor = "grab"; // Revert cursor after drag
        });

        // Mouse move event
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return; // Exit if mouse is not down
            console.log('Mouse move event');
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Adjust the scroll speed
            container.scrollLeft = scrollLeft - walk;
        });
    });
});
