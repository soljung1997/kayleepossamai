
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
    var overlayText = document.querySelector('.overlay-text');

    if (scrollPosition > 500) {
        overlayText.style.color = "#fff"; /* White text */
    } else {
        overlayText.style.color = "#000"; /* Black text */
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const photo1Container = document.querySelector('.photo-1');
    const photo1Image = photo1Container.querySelector('img');

    window.addEventListener('scroll', function() {
        const navbarHeightVH = 10; // Adjust if there's a fixed navbar
        const windowHeight = window.innerHeight;
        const navbarHeight = (navbarHeightVH / 100) * windowHeight; // Convert 10vh to pixels
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const containerTop = photo1Container.getBoundingClientRect().top + scrollPosition - navbarHeight;
        const containerHeight = photo1Container.offsetHeight;
        
        if (scrollPosition >= containerTop && scrollPosition - navbarHeight < containerTop + containerHeight) {
            
            const visibleHeight = Math.max(0, containerHeight + navbarHeight - (scrollPosition - containerTop));
            photo1Image.style.clipPath = `inset(0 0 ${containerHeight - visibleHeight + navbarHeight}px 0)`;
            photo1Image.style.transform = `translateY(${scrollPosition - containerTop}px)`;
        } else if (scrollPosition + windowHeight >= containerTop && scrollPosition + navbarHeight < containerTop) {
            
            const visibleHeight = Math.max(0, containerHeight - (containerTop + containerHeight - (scrollPosition + windowHeight)));
            
            photo1Image.style.clipPath = `inset(${containerHeight - visibleHeight + navbarHeight}px 0 0 0)`;
            photo1Image.style.transform = `translateY(${scrollPosition - containerTop + navbarHeight}px)`;
            
            
            
        } else {
            photo1Image.style.clipPath = 'inset(0 0 0 0)';
            photo1Image.style.transform = 'translateY(0)';
        }

        
    });
});

document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        console.log('Scroll Position:', scrollPosition);
    });
});
