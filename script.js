// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Smooth scrolling for CTA buttons
const ctaButtons = document.querySelectorAll('a[href^="#"]');
ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Elements to animate on scroll
const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
animatedElements.forEach(el => {
    observer.observe(el);
});

// Add animation classes to elements
document.addEventListener('DOMContentLoaded', () => {
    // Hero section animations
    const heroText = document.querySelector('.hero-text');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroText) heroText.classList.add('slide-in-left');
    if (heroVisual) heroVisual.classList.add('slide-in-right');

    // Section animations
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        const elements = section.querySelectorAll('.section-header, .service-card, .result-card, .testimonial-card, .mvv-item, .contact-info, .contact-form');
        elements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    });
});

/// Form validation and submission (EmailJS)
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');

    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError'); // Adicione <span id="phoneError"></span> no HTML
    const messageError = document.getElementById('messageError');

    // Reset previous errors
    clearErrors();

    let hasErrors = false;

    // Validate name
    if (!name.value.trim()) {
        showError(nameError, 'Nome é obrigatório');
        hasErrors = true;
    } else if (name.value.trim().length < 4) {
        showError(nameError, 'Nome deve ter pelo menos 4 caracteres');
        hasErrors = true;
    }

    // Validate email
    if (!email.value.trim()) {
        showError(emailError, 'Email é obrigatório');
        hasErrors = true;
    } else if (!isValidEmail(email.value)) {
        showError(emailError, 'Email inválido');
        hasErrors = true;
    }

    // Validate phone
    if (!phone.value.trim()) {
        showError(phoneError, 'Telefone é obrigatório');
        hasErrors = true;
    } else if (phone.value.replace(/\D/g, '').length < 10) {
        showError(phoneError, 'Telefone deve ter pelo menos 10 dígitos (DDD + número)');
        hasErrors = true;
    }

    // Validate message
    if (!message.value.trim()) {
        showError(messageError, 'Mensagem é obrigatória');
        hasErrors = true;
    } else if (message.value.trim().length < 10) {
        showError(messageError, 'Mensagem deve ter pelo menos 10 caracteres');
        hasErrors = true;
    }

    if (hasErrors) return;

    // Loading state
    const submitButton = contactForm.querySelector('.btn');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;

    // EmailJS Params (altere se precisar)
    const templateParams = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        message: message.value,
    };

    try {
        // Envia pelo EmailJS
        await emailjs.send('service_8h2no1d', 'template_bhs4c57', templateParams);

        // Sucesso
        successMessage.classList.add('show');
        contactForm.reset();

        // Esconde a mensagem de sucesso depois de 5s
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);

    } catch (err) {
        console.error('Erro ao enviar:', err);
        alert('Ocorreu um erro ao enviar sua mensagem. Tente novamente em instantes.');
    } finally {
        // Resetar botão
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

// Helpers
function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper functions for form validation
function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone number formatting (Brazilian format)
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value.replace(/(\d{0,2})/, '($1');
            } else if (value.length <= 7) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }

        e.target.value = value;
    });
}

// Add loading animation to service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
});

// Counter animation for stats
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent.replace(/\d+/, target);
            }
        };

        updateCounter();
    });
};

// Trigger counter animation when hero section is visible
const heroSection = document.querySelector('.hero');
if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 1000);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    heroObserver.observe(heroSection);
}

// Parallax effect for hero shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Add hover effects to result cards
const resultCards = document.querySelectorAll('.result-card');
resultCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Lazy loading for images (if any are added later)
const lazyImages = document.querySelectorAll('img[data-src]');
if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

// Add click tracking for analytics (placeholder)
const trackClick = (elementType, elementName) => {
    console.log(`Clicked: ${elementType} - ${elementName}`);
    // In a real application, you would send this data to your analytics service
};

// Track CTA button clicks
const ctaButtonsTracking = document.querySelectorAll('.btn-primary');
ctaButtonsTracking.forEach(button => {
    button.addEventListener('click', () => {
        trackClick('CTA Button', button.textContent.trim());
    });
});

// Track service card interactions
serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const serviceName = card.querySelector('h3').textContent;
        trackClick('Service Card', serviceName);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add focus management for accessibility
const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
        element.style.outline = '2px solid var(--accent-color)';
        element.style.outlineOffset = '2px';
    });

    element.addEventListener('blur', () => {
        element.style.outline = 'none';
    });
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
const optimizedScrollHandler = () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
        // Scroll-dependent operations go here
        updateActiveNavLink();
    }, 16); // ~60fps
};

// Update active navigation link based on scroll position
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = navbar.offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', optimizedScrollHandler);

// Create particle system
function createParticles() {
    const particlesContainer = document.getElementById('particles-bg');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth < 768 ? 20 : 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Enhanced mobile touch handling
function addTouchEffects() {
    const cards = document.querySelectorAll('.service-card, .result-card, .testimonial-card, .mvv-item');

    cards.forEach(card => {
        card.addEventListener('touchstart', (e) => {
            card.style.transform = 'scale(0.98)';
        });

        card.addEventListener('touchend', (e) => {
            setTimeout(() => {
                card.style.transform = '';
            }, 100);
        });
    });
}

// Enhanced scroll animations for mobile
function optimizeAnimationsForMobile() {
    if (window.innerWidth < 768) {
        // Reduce animation complexity on mobile
        const style = document.createElement('style');
        style.textContent = `
            .glitch-text::before,
            .glitch-text::after {
                display: none;
            }
            .particle {
                animation-duration: 25s !important;
            }
            .shape {
                animation-duration: 8s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Add tech-style cursor effect for desktop
function addCursorEffect() {
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #00d4ff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = (e.clientX - 10) + 'px';
            cursor.style.top = (e.clientY - 10) + 'px';
        });

        // Scale cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .result-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body and remove after page load
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
        document.body.classList.remove('loading');

        // Initialize tech effects
        createParticles();
        addTouchEffects();
        optimizeAnimationsForMobile();
        addCursorEffect();

        // Trigger initial animations
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero .slide-in-left, .hero .slide-in-right');
            heroElements.forEach(el => el.classList.add('visible'));
        }, 300);
    });

    // Initialize scroll position
    updateActiveNavLink();

    console.log('TSA Soluções Landing Page initialized successfully!');
});

// Optimize performance on mobile
if (window.innerWidth < 768) {
    // Disable some heavy animations on mobile for better performance
    document.addEventListener('DOMContentLoaded', () => {
        const heavyAnimations = document.querySelectorAll('.glitch-text');
        heavyAnimations.forEach(el => {
            el.classList.remove('glitch-text');
        });
    });
}

// Add intersection observer for better mobile performance
const createOptimizedObserver = () => {
    const options = {
        threshold: window.innerWidth < 768 ? 0.05 : 0.1,
        rootMargin: window.innerWidth < 768 ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    };

    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, options);
};

// Replace the existing observer
const optimizedObserver = createOptimizedObserver();
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => {
        optimizedObserver.observe(el);
    });
});
