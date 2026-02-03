document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger lines
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Menu Category Tabs (for menu.html)
    const catBtns = document.querySelectorAll('.cat-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    if (catBtns.length > 0) {
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                catBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');

                // Filter items
                menuItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'flex';
                        // Add fade in animation
                        item.style.opacity = '0';
                        setTimeout(() => item.style.opacity = '1', 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Dark Mode Toggle (Optional implementation if UI exists)
    // We can add a button typically in the navbar
    const theme = localStorage.getItem('theme');
    if (theme) {
        document.body.setAttribute('data-theme', theme);
    }

    // Toggle function to be called from a button
    window.toggleTheme = function () {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.menu-item, .gallery-item, .review-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add class for animation when in view
    document.addEventListener('scroll', () => {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });
    // Inline Map Toggle
    const mapCover = document.getElementById('map-cover');

    if (mapCover) {
        mapCover.addEventListener('click', () => {
            // Fade out cover
            mapCover.style.opacity = '0';
            // Disable interaction with cover so iframe can be clicked
            mapCover.style.pointerEvents = 'none';
        });
    }

    // Dynamic Favicon Fix (Square Aspect Ratio)
    const setSquareFavicon = () => {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';

        const img = new Image();
        // Ensure we load the logo correctly
        img.src = 'images/logo.png';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = Math.max(img.width, img.height);
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, size, size);
            // Center the image
            const x = (size - img.width) / 2;
            const y = (size - img.height) / 2;
            ctx.drawImage(img, x, y);

            link.href = canvas.toDataURL();
            document.head.appendChild(link);
        };
    };
    // Run favicon fix
    setSquareFavicon();

});
