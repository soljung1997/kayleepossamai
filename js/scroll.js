document.addEventListener("DOMContentLoaded", function() {
    const containers = document.querySelectorAll('.portfolio-container');

    if (containers.length === 0) {
        console.error('No containers found!');
        return;
    }

    containers.forEach(container => {
        console.log('Adding scroll listeners to container:', container);

        // Horizontal scrolling with mouse wheel
        container.addEventListener('wheel', function(e) {
            console.log('Mouse wheel detected');
            e.preventDefault();
            container.scrollLeft += e.deltaY;
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
            if (!isDown) return;
            console.log('Mouse move event');
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
            container.scrollLeft = scrollLeft - walk;
        });
    });
});
