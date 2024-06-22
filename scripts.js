
//for determining the width and height of an image to prevent layout shifts

// script.js
window.addEventListener('load', function() {
    const img = document.getElementsByClassName('photo')[0];
    const container = img.parentElement;

    // Check if the image is already loaded
    if (img.complete) {
        setDimensions(img, container);
    } else {
        img.onload = function() {
            setDimensions(img, container);
        };
    }
});

function setDimensions(img, container) {
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Calculate the aspect ratio
    const aspectRatio = naturalWidth / naturalHeight;

    // Get container dimensions
    const containerWidth = container.clientWidth;

    // Set image dimensions to fit within the container, maintaining aspect ratio
    const imgWidth = Math.min(naturalWidth, containerWidth);
    const imgHeight = imgWidth / aspectRatio;

    img.width = imgWidth;
    img.height = imgHeight;
    img.style.width = imgWidth + 'px';
    img.style.height = imgHeight + 'px';
}

function getContrastingColor(rgb) {
    const rgbValues = rgb.match(/\d+/g);
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'black' : 'white';
}

window.onload = function() {
    adjustBodyPadding();  // Adjust on load
    window.onresize = adjustBodyPadding;  // Adjust when window is resized
};

function adjustBodyPadding() {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    document.body.style.paddingTop = `${navbarHeight}px`;
}

//for loading light, dark mode.
  

  document.addEventListener('DOMContentLoaded', function() {
    const images = [
        { src: 'images/modeling/Blue_Headshot/blue1.jpg', link: '#' },
        { src: 'images/modeling/Dark_Headshot/black1.jpg', link: '#' },
        { src: 'images/modeling/Dark_Headshot/dark1.jpg', link: '#' },
        { src: 'images/modeling/Grey_Headshot/grey3.jpg', link: '#' },
        { src: 'images/modeling/Misc/misc2.jpg', link: '#' },
        { src: 'images/modeling/Professional_White/professional5.jpg', link: '#' },
        { src: 'images/modeling/White_Headshot/white1.jpg', link: '#' },
        { src: 'images/modeling/Misc/misc2.jpg', link: '#' },
        { src: 'images/modeling/White_Headshot/white4.jpg', link: '#' },
        // Add more images as needed
    ];

    document.getElementById('dropbtn').addEventListener('click', function() {
        document.getElementById('dropdown-content').classList.toggle('show');
    });

    function distributeImages(columns, images) {
        images.forEach((image, index) => {
            const container = document.createElement('div');
            container.classList.add('sticky-container');

            const anchor = document.createElement('a');
            anchor.href = image.link;
            anchor.target = '_blank'; // Optional: Open link in a new tab

            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.classList.add('sticky-image');
            imgElement.alt = '';

            imgElement.onload = function() {
                // Calculate the aspect ratio and set the container height accordingly
                const ratio = imgElement.naturalHeight / imgElement.naturalWidth;
                container.style.height = `${container.clientWidth * ratio}px`;
            };

            anchor.appendChild(imgElement);
            container.appendChild(anchor);
            columns[index % columns.length].appendChild(container);
        });
    }

    const columns = [
        document.getElementById('album-container-1'),
        document.getElementById('album-container-2'),
        document.getElementById('album-container-3')
    ];

    distributeImages(columns, images);

    function updateContainerHeights() {
        const containers = document.querySelectorAll('.sticky-container');
        containers.forEach(container => {
            const imgElement = container.querySelector('img');
            const ratio = imgElement.naturalHeight / imgElement.naturalWidth;
            container.style.height = `${container.clientWidth * ratio}px`;
        });
    }

    window.addEventListener('resize', updateContainerHeights);

    window.addEventListener('scroll', function() {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const images = document.querySelectorAll('.sticky-image');

        images.forEach(image => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const container = image.parentElement.parentElement;
            const containerTop = container.getBoundingClientRect().top + scrollPosition - navbarHeight;
            const containerHeight = container.offsetHeight;

            if (scrollPosition >= containerTop && scrollPosition < containerTop + containerHeight) {
                const visibleHeight = Math.max(0, containerHeight - (scrollPosition - containerTop));
                image.style.clipPath = `inset(0 0 ${containerHeight - visibleHeight}px 0)`;
                image.style.transform = `translateY(${scrollPosition - containerTop}px)`;
            } else {
                image.style.clipPath = 'inset(0 0 0 0)';
                image.style.transform = 'translateY(0)';
            }
        });
    });

    updateContainerHeights(); // Initial call to set heights
});


document.addEventListener('DOMContentLoaded', function() {
    const stickyImage = document.getElementById('sticky-image');
    const footer = document.querySelector('.footer');
    const container = document.querySelector('.sticky-image-container');
    const initialTop = stickyImage.getBoundingClientRect().top;

    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY || window.pageYOffset;
        const footerTop = footer.getBoundingClientRect().top + scrollY;
        const containerTop = container.getBoundingClientRect().top + scrollY;
        const containerHeight = container.offsetHeight;
        const stickyImageHeight = stickyImage.offsetHeight;

        const stickyTop = parseInt(window.getComputedStyle(stickyImage).top, 10) || 0;

        // When the bottom of the image reaches the footer
        if (footerTop <= (scrollY + stickyImageHeight + stickyTop)) {
            // Adjust the top position dynamically to ensure it doesn't overlap the footer
            stickyImage.style.top = `${footerTop - scrollY - stickyImageHeight}px`;
        } else {
            // Reset the top position when it's not near the footer
            stickyImage.style.top = '12vh'; // Adjust based on your layout
        }
    });
});



