
//for determining the width and height of an image to prevent layout shifts

// script.js

document.addEventListener("DOMContentLoaded", function() {
    // Remove the padding
    document.body.style.paddingTop = '';
});
window.onscroll = function() {
    scrollFunction();
    scrollBodyColor();
    scrollOverlayTextColor();
};

function scrollFunction() {
    var scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollPosition > 650) {
        document.getElementById("navbar").classList.add("scrolled");
    } else {
        document.getElementById("navbar").classList.remove("scrolled");
    }
}

function scrollBodyColor() {
    var scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;

    if (scrollPosition > 700) {
        document.body.style.backgroundColor = "#fff";
        document.body.style.color = "#fff"; /* White text */
    } else {
        document.body.style.backgroundColor = "#000"; /* Black */
        document.body.style.color = "#fff"; /* White text */

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

/*
document.addEventListener('DOMContentLoaded', function() {

    window.addEventListener('scroll', function() {
        const navbarHeightVH = 10; // Adjust if there's a fixed navbar
        const windowHeight = window.innerHeight;
        const navbarHeight = (navbarHeightVH / 100) * windowHeight; // Convert 10vh to pixels
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        for(let i = 1; i <= 4; i++){
            let elements = `.photo-individual-${i}`;
            const photoContainers = document.querySelectorAll(elements);
            photoContainers.forEach(elements => {
                const photoImage = elements.querySelector('img');
                const containerTop = elements.getBoundingClientRect().top + scrollPosition - navbarHeight;
                const containerHeight = elements.offsetHeight;
    
                if (scrollPosition >= containerTop && scrollPosition - navbarHeight < containerTop + containerHeight) {
                    console.log("Bottom");
                    console.log("WH: " + windowHeight + "containerTop: " + containerTop + "navbar:" + navbarHeight);
                    const visibleHeight = Math.max(0, containerHeight + navbarHeight - (scrollPosition - containerTop));
                    photoImage.style.clipPath = `inset(0 0 ${containerHeight - visibleHeight + navbarHeight}px 0)`;
                    photoImage.style.transform = `translateY(${scrollPosition - containerTop}px)`;
                } else if (scrollPosition + windowHeight >= containerTop && scrollPosition + navbarHeight < containerTop) { //if scroll + height of VP less than container top, and scroll + navbar greater than container top
                    const visibleHeight = Math.max(0, containerHeight - (containerTop + containerHeight - (scrollPosition + windowHeight)));
                    console.log("Top");
                    console.log("WH: " + windowHeight + " containerTop: " + containerTop + " navbar:" + navbarHeight);
                    photoImage.style.clipPath = `inset(${containerHeight - visibleHeight + navbarHeight}px 0 0 0)`;
                    photoImage.style.transform = `translateY(${scrollPosition - containerTop + navbarHeight}px)`;
                } else {
                    console.log("Else");
                    console.log("WH: " + windowHeight + " containerTop: " + containerTop + " navbar:" + navbarHeight);
                    photoImage.style.clipPath = 'inset(0 0 0 0)';
                    photoImage.style.transform = 'translateY(0)';
                }
            });
        }
    });
});*/

document.addEventListener('DOMContentLoaded', function() {

    window.addEventListener('scroll', function() {
        const navbarHeightVH = 10; // Adjust if there's a fixed navbar
        const windowHeight = window.innerHeight;
        const navbarHeight = (navbarHeightVH / 100) * windowHeight; // Convert 10vh to pixels
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        
        for (let i = 1; i <= 4; i++) {
            let elements = `.photo-individual-${i}`;
            let images = `.scroll-image-${i}`;
            const photoContainers = document.querySelectorAll(elements);
            
            photoContainers.forEach(element => {
                const photoImage = element.querySelector('img');
                const containerTop = element.getBoundingClientRect().top;
                const containerBottom = element.getBoundingClientRect().bottom;
                const containerHeight = element.offsetHeight;
                const padding = containerTop * 0.2;

                console.log(`Element: .photo-individual-${i}`);
                console.log(`Container Top: ${containerTop}`);
                console.log(`Container Height: ${containerHeight}`);
                console.log(`Navbar Height: ${navbarHeight}`);
                console.log("NH:" + (navbarHeight) + " CB: " + (containerBottom));


                if (navbarHeight <= containerTop || containerBottom >= windowHeight) { //if top of container touches bottom of VP
                    console.log("bottom");
                    console.log("CB: " + containerBottom + " windowH: " + windowHeight);
                    const visibleHeight = Math.max(0, + -((containerBottom - windowHeight) - containerHeight));
                    console.log("CH: " +  containerHeight + " WH:" + (windowHeight) + " CB: " + (containerBottom));
                    console.log(`Visible Height (Bottom): ${visibleHeight}`);
                    const clip = photoImage.style.clipPath = `inset(${containerHeight - visibleHeight - navbarHeight}px 0 0 0)`; //has to be positive to 0
                    console.log("clip:" + clip);
                    const transform = photoImage.style.transform = `translateY(-${containerHeight - visibleHeight - navbarHeight}px)`; //should move with container height
                    console.log("transform: " + transform);
                } else if (navbarHeight >= containerTop && windowHeight >= containerBottom) { //if top of container touches top of VP & top of VP <= bottom of container
                    console.log("Top");
                    console.log("CT:" + (containerTop) + " NH: " + (navbarHeight) + "WH:" + (windowHeight) + " CB: " + (containerBottom));
                    const visibleHeight = Math.max(0, containerBottom);
                    console.log(`Visible Height (Top): ${visibleHeight}`);
                    const clip = photoImage.style.clipPath = `inset(0 0 ${containerHeight - visibleHeight + navbarHeight}px 0)`;
                    console.log("clip:" + clip);
                    const transform = photoImage.style.transform = `translateY(${containerHeight - visibleHeight + navbarHeight}px)`;
                    console.log("transform: " + transform);
                } else {
                    console.log("Else");
                    photoImage.style.clipPath = `inset(0 0 0 0)`;
                    const transform = photoImage.style.transform = `translateY(0px)`;
                    console.log("transform: " + transform);
                }
            });
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        console.log('Scroll Position:', scrollPosition);
    });
});
