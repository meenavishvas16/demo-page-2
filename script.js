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
    // Map Modal Logic moved to global scope

    // Close modal if clicking outside content
    const mapModal = document.getElementById('map-modal');
    if (mapModal) {
        mapModal.addEventListener('click', (e) => {
            if (e.target === mapModal) {
                window.closeMap();
            }
        });
    }

    // Star Rating Logic
    const starContainer = document.querySelector('.stars-input');
    const ratingInput = document.getElementById('review-rating');

    if (starContainer && ratingInput) {
        const stars = starContainer.querySelectorAll('i');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.getAttribute('data-value'));
                ratingInput.value = value;

                // Update visuals
                stars.forEach((s, index) => {
                    if (index < value) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });

            star.addEventListener('mouseover', () => {
                const value = parseInt(star.getAttribute('data-value'));
                stars.forEach((s, index) => {
                    if (index < value) {
                        s.style.transform = 'scale(1.2)';
                    }
                });
            });

            star.addEventListener('mouseout', () => {
                stars.forEach(s => s.style.transform = 'scale(1)');
            });
        });
    }

    // Review Form Submission
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('review-name').value;
            const rating = ratingInput.value;
            const text = document.getElementById('review-text').value;

            if (rating === "0") {
                alert("Please select a star rating!");
                return;
            }

            // Simulate submission
            const btn = reviewForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Submitting...";
            btn.disabled = true;

            setTimeout(() => {
                alert(`Thank you ${name}! Your review has been submitted for approval.`);
                reviewForm.reset();
                // Reset stars
                if (starContainer) {
                    starContainer.querySelectorAll('i').forEach(s => {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    });
                }
                ratingInput.value = "0";
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // Inline Map Toggle
    const mapCover = document.getElementById('map-cover');
    const mapFrame = document.getElementById('map-frame');

    if (mapCover) {
        mapCover.addEventListener('click', () => {
            // Fade out cover
            mapCover.style.opacity = '0';
            mapCover.style.pointerEvents = 'none';
            // Frame is behind, so it becomes visible.
            // Optional: You could reload the iframe source here to ensure it loads on demand.
        });
    }

});
