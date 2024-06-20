window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    const navbar = document.getElementById('navbar');
    const navLinks = navbar.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            const sectionBgColor = window.getComputedStyle(section).backgroundColor;
            const textColor = getContrastingColor(sectionBgColor);

            navLinks.forEach(link => {
                link.style.color = textColor;
            });
        }
    });
});

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


document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('bd-theme');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const themeItems = document.querySelectorAll('.dropdown-item');
  
    toggleButton.addEventListener('click', () => {
      dropdownMenu.classList.toggle('show');
    });
  
    themeItems.forEach(item => {
      item.addEventListener('click', () => {
        const theme = item.getAttribute('data-theme');

        
        applyTheme(theme);

        themeItems.forEach(i => {
          const checkIcon = i.querySelector('.check-icon');
          if (checkIcon) {
              checkIcon.classList.add('d-none');
          }
        });

      // Show the check sign for the clicked item
        const checkIcon = item.querySelector('.check-icon');
        if (checkIcon) {
            checkIcon.classList.remove('d-none');
        }
          dropdownMenu.classList.remove('show');
      });
    });

    function setInitialTheme() {
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      let currentTheme = 'light';

      if (document.body.classList.contains('dark-mode')) {
          currentTheme = 'dark';
      } else if (prefersDarkScheme) {
          currentTheme = 'dark';
      }

      applyTheme(currentTheme);

      // Show the correct check sign
      themeItems.forEach(item => {
          const theme = item.getAttribute('data-bs-theme-value');
          const checkIcon = item.querySelector('.check-icon');
          if (checkIcon) {
              if (theme === currentTheme) {
                  checkIcon.classList.remove('dropdown-hide');
              } else {
                  checkIcon.classList.add('dropdown-hide');
              }
          }
      });
  }
  
    function applyTheme(theme) {
      document.body.classList.remove('light-mode', 'dark-mode');
      if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--light-bg');
    } else if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-bg');
    } else if (theme === 'auto') {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.add(prefersDarkScheme ? 'dark-mode' : 'light-mode');
        const bgColor = prefersDarkScheme ? getComputedStyle(document.documentElement).getPropertyValue('--dark-bg') : getComputedStyle(document.documentElement).getPropertyValue('--light-bg');
        document.body.style.backgroundColor = bgColor;
    }
    }
  });
  

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



