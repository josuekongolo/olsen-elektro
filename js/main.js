/* ========================================
   OLE KRISTIAN OLSEN ELEKTRO
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // ----------------------------------------
    // Mobile Navigation
    // ----------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('mobile-open');

            // Toggle aria-expanded
            const isExpanded = mainNav.classList.contains('mobile-open');
            this.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('mobile-open');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('mobile-open')) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('mobile-open');
            }
        });
    }

    // ----------------------------------------
    // Header Scroll Effect
    // ----------------------------------------
    const header = document.querySelector('.header');
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // ----------------------------------------
    // Contact Form Handling
    // ----------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.disabled = true;

            // Collect form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                serviceType: formData.get('service-type'),
                message: formData.get('message')
            };

            try {
                // For demo purposes, simulate success after 1.5 seconds
                // In production, replace with actual Resend API call
                await simulateFormSubmission(data);

                // Show success message
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                formError.style.display = 'none';

            } catch (error) {
                console.error('Form submission error:', error);

                // Show error message
                contactForm.style.display = 'none';
                formSuccess.style.display = 'none';
                formError.style.display = 'block';
            } finally {
                // Reset button state
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }

    // Simulate form submission (replace with actual API call in production)
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    console.log('Form data:', data);
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 1500);
        });
    }

    // ----------------------------------------
    // Smooth Scroll for Anchor Links
    // ----------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href !== '#') {
                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (mainNav && mainNav.classList.contains('mobile-open')) {
                        mobileMenuBtn.classList.remove('active');
                        mainNav.classList.remove('mobile-open');
                    }
                }
            }
        });
    });

    // ----------------------------------------
    // Scroll to Hash on Page Load
    // ----------------------------------------
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // ----------------------------------------
    // Lazy Loading Images (Native)
    // ----------------------------------------
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }

    // ----------------------------------------
    // Form Input Validation Feedback
    // ----------------------------------------
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });

        // Real-time validation for email
        if (input.type === 'email') {
            input.addEventListener('input', function() {
                if (this.validity.typeMismatch) {
                    this.setCustomValidity('Vennligst skriv inn en gyldig e-postadresse');
                } else {
                    this.setCustomValidity('');
                }
            });
        }

        // Real-time validation for phone
        if (input.type === 'tel') {
            input.addEventListener('input', function() {
                // Allow only digits, spaces, and common phone symbols
                this.value = this.value.replace(/[^\d\s+()-]/g, '');
            });
        }
    });

    // ----------------------------------------
    // Intersection Observer for Animations
    // ----------------------------------------
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .why-item, .testimonial-card, .value-card').forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });

    // ----------------------------------------
    // Click to Call Analytics (placeholder)
    // ----------------------------------------
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track phone call clicks
            console.log('Phone click tracked:', this.href);

            // If using Google Analytics:
            // gtag('event', 'click', {
            //     'event_category': 'Contact',
            //     'event_label': 'Phone Call'
            // });
        });
    });

    // ----------------------------------------
    // Email Link Analytics (placeholder)
    // ----------------------------------------
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track email clicks
            console.log('Email click tracked:', this.href);
        });
    });
});

// ----------------------------------------
// CSS for Animations (add to style.css)
// ----------------------------------------
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-ready {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .header.scrolled {
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(animationStyles);
