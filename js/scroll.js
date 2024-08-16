document.addEventListener("DOMContentLoaded", function() {
    const containers = document.querySelectorAll('.portfolio-container');

    containers.forEach(container => {
        // Horizontal scrolling with mouse wheel
        container.addEventListener('wheel', function(e) {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        });

        // Variables for dragging
        let isDown = false;
        let startX;
        let scrollLeft;

        // Mouse down event
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            container.style.cursor = "grabbing"; // Change cursor to grabbing during drag
        });

        // Mouse leave event
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
            container.style.cursor = "grab"; // Revert cursor after drag
        });

        // Mouse up event
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
            container.style.cursor = "grab"; // Revert cursor after drag
        });

        // Mouse move event
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
            container.scrollLeft = scrollLeft - walk;
        });
    });
});
