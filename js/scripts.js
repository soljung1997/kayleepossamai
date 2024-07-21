
//for determining the width and height of an image to prevent layout shifts

// script.js

document.addEventListener("DOMContentLoaded", function() {
    // Remove the padding
    document.body.style.paddingTop = '';
});
window.onscroll = function() {
    scrollFunction();
    scrollBodyColor();
};

function scrollFunction() {
    var scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollPosition > 900) {
        document.getElementById("navbar").classList.add("scrolled");
    } else {
        document.getElementById("navbar").classList.remove("scrolled");
    }
}

function scrollBodyColor() {
    var scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
    var gradient1 = document.querySelector('.photo-container-background');
    var gradient2 = document.querySelector('.filler-4-gradient-2');
    var gradient3 = document.querySelector(".photo-container-2-background");
    var gradient4 = document.querySelector(".album-container-background");
    var album2 = document.querySelector('.photo-individual-4');
    var text = document.querySelector(".text-box");
    var mainContainer = document.querySelector('.main-container-about');
    var navbarGradient = document.querySelector('.navbar-gradient');
    
    if (scrollPosition > 900) {
        if (gradient1) gradient1.style.opacity = 1;
        if (gradient2) gradient2.style.opacity = 1;
        if (gradient3) gradient3.style.opacity = 1;
        if (gradient4) gradient4.style.opacity = 1;
        if (album2) album2.style.opacity = 1;
        document.body.style.backgroundColor = "#fff";
        if (mainContainer) mainContainer.style.backgroundColor = "#fff";
        if (text) text.style.color = "#000";
        if (navbarGradient) navbarGradient.style.opacity = 1;
    } else {
        if (gradient1) gradient1.style.opacity = 0;
        if (gradient2) gradient2.style.opacity = 0;
        if (gradient3) gradient3.style.opacity = 0;
        if (gradient4) gradient4.style.opacity = 0;
        if (album2) album2.style.opacity = 0;
        document.body.style.backgroundColor = "#000"; /* Black */
        if (mainContainer) mainContainer.style.backgroundColor = "#000";
        if (text) text.style.color = "#fff";
        if (navbarGradient) navbarGradient.style.opacity = 0;
    }
}


function scrollOverlayTextColor() {
    var scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
    var overlayTexts = document.querySelectorAll('.color-change');

    overlayTexts.forEach(function(overlayText) {
        if (scrollPosition > 500) {
            overlayText.style.color = "#000"; // White text
        } else {
            overlayText.style.color = "#fff"; // Black text
        }
    });
}

// Attach the function to the window's scroll event
window.addEventListener('scroll', scrollOverlayTextColor);


document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    });
});

document.addEventListener('DOMContentLoaded', function() {

    const img1 = document.querySelector('.photo-individual-1');
    const img2 = document.querySelector('.photo-individual-2');
    const img3 = document.querySelector('.photo-individual-3');
    const img4 = document.querySelector('.photo-individual-4');
    const img5 = document.querySelector('.photo-individual-5');
    const img6 = document.querySelector('.photo-individual-6');
    const img7 = document.querySelector('.photo-individual-7');
    
    // Store the original positions
    const containerOriginalTop = {
        img1: img1 ? img1.getBoundingClientRect().top : 0,
        img2: img2 ? img2.getBoundingClientRect().top : 0,
        img3: img3 ? img3.getBoundingClientRect().top : 0,
        img4: img4 ? img4.getBoundingClientRect().top : 0,
        img5: img5 ? img5.getBoundingClientRect().top : 0,
        img6: img6 ? img6.getBoundingClientRect().top : 0,
        img7: img7 ? img7.getBoundingClientRect().top : 0
    };

    window.addEventListener('scroll', function() {
        // Static variables
        const navbarHeightVH = 10; // Adjust if there's a fixed navbar
        const windowHeight = window.innerHeight;
        const navbarHeight = (navbarHeightVH / 100) * windowHeight; // Convert 10vh to pixels
        const windowTop = navbarHeight;
        const windowBottom = windowHeight;
        // Dynamic variables
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        for (let i = 1; i <= 7; i++) {
            let elements = `.photo-individual-${i}`;
            const photoContainers = document.querySelectorAll(elements);
            
            photoContainers.forEach(element => {
                const photoImage = element.querySelector('img');

                // Log to see if the image is being processed
                console.log(`Processing image in container .photo-individual-${i}:`, photoImage);

                // Dynamic variables
                const containerTop = element.getBoundingClientRect().top;
                const containerBottom = element.getBoundingClientRect().bottom;
                const containerHeight = element.offsetHeight;
                const augmentedContainerHeight = containerHeight - windowHeight;

                // Access the original position using the originalPos object
                const originalPosition = containerOriginalTop[`img${i}`];

                console.log(`Container ${i} - Top: ${containerTop}, Bottom: ${containerBottom}, Height: ${containerHeight}`);

                if (containerTop < 0) { // If top of container touches bottom of VP
                    const visibleHeight = -(containerTop);
                    if (containerHeight > windowHeight){
                        photoImage.style.clipPath = `inset(0 0 ${(-containerTop) - augmentedContainerHeight}px 0)`;
                        photoImage.style.transform = `translateY(${-(containerTop) - augmentedContainerHeight}px)`;
                    } else {
                        photoImage.style.clipPath = `inset(0 0 ${(-containerTop)}px 0)`;
                        photoImage.style.transform = `translateY(${-(containerTop)}px)`;
                    }
                } else if(containerTop <= windowBottom && containerBottom >= windowBottom){
                    const visibleHeight = containerBottom - windowHeight; // Will be a negative number, so convert
                    photoImage.style.clipPath = `inset(${visibleHeight}px 0 0 0)`;
                    photoImage.style.transform = `translateY(${-(containerTop - windowHeight + containerHeight)}px)`;
                } else{
                    photoImage.style.clipPath = `inset(0 0 0 0)`;
                    photoImage.style.transform = `translateY(0)`;
                    
                }
            });
        }
    });
});
