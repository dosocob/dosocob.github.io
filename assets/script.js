// ================================
// MODERN PORTFOLIO - JAVASCRIPT
// ================================

(function() {
    'use strict';

    // ================================
    // NAVBAR SCROLL EFFECT
    // ================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ================================
    // SMOOTH SCROLLING
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================
    // TYPING EFFECT
    // ================================
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const texts = [
            'Creative Developer & Designer',
            'Full Stack Engineer',
            'UI/UX Enthusiast',
            'Problem Solver'
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 1000);
    }

    // ================================
    // COUNTER ANIMATION
    // ================================
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateCounters = () => {
        if (hasAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });

        hasAnimated = true;
    };

    // ================================
    // INTERSECTION OBSERVER
    // ================================
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger counter animation when stats section is visible
                if (entry.target.querySelector('.stat-number')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const observeElements = document.querySelectorAll(
        '.skill-card, .project-card, .about-content, .contact-content, .stats-grid'
    );

    observeElements.forEach(el => {
        el.classList.add('slide-up');
        observer.observe(el);
    });

    // ================================
    // SKILL CARDS HOVER EFFECT
    // ================================
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });

    // ================================
    // PROJECT CARDS TILT EFFECT
    // ================================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `translateY(-10px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // ================================
    // PARALLAX EFFECT
    // ================================
    const heroVisual = document.querySelector('.hero-visual');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        if (heroVisual && scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });

    // ================================
    // MOBILE MENU TOGGLE
    // ================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');

            // Animate hamburger icon
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (mobileMenuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ================================
    // FORM HANDLING
    // ================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.querySelector('span').textContent;

            // Show loading state
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                submitBtn.querySelector('span').textContent = 'Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

                // Reset form
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });

        // Add floating label effect
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }

    // ================================
    // CURSOR EFFECTS (Optional Enhancement)
    // ================================
    const createCursorFollower = () => {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(99, 102, 241, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease, opacity 0.15s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.1;
            cursorY += dy * 0.1;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        // Scale cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .skill-card, .project-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    };

    // Enable cursor follower on desktop only
    if (window.innerWidth > 768) {
        createCursorFollower();
    }

    // ================================
    // ACTIVE NAVIGATION HIGHLIGHT
    // ================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinksArray.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);

    // ================================
    // LAZY LOADING IMAGES (if any)
    // ================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ================================
    // PERFORMANCE OPTIMIZATION
    // ================================

    // Debounce function for scroll events
    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll-heavy functions
    window.addEventListener('scroll', debounce(() => {
        // Additional scroll-based animations can be added here
    }, 10));

    // ================================
    // PRELOADER (Optional)
    // ================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger initial animations
        setTimeout(() => {
            document.querySelectorAll('.hero-text, .hero-visual').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 100);
    });

    // ================================
    // CONSOLE EASTER EGG
    // ================================
    const styles = [
        'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'color: white',
        'padding: 10px 20px',
        'border-radius: 5px',
        'font-size: 16px',
        'font-weight: bold'
    ].join(';');

    console.log('%c👋 Hello Developer!', styles);
    console.log('%cLooking for something? Let\'s connect!', 'color: #667eea; font-size: 14px;');
    console.log('%chttps://github.com/dosocob', 'color: #764ba2; font-size: 12px;');

    // ================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================

    // Add focus visible class for keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });

    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to content';
    skipLink.style.cssText = `
        position: absolute;
        top: -100px;
        left: 0;
        background: var(--primary);
        color: white;
        padding: 10px 20px;
        z-index: 10000;
        text-decoration: none;
        border-radius: 0 0 5px 0;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-100px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

})();
