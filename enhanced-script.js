// Melhorias JavaScript para Landing Page TSA Soluções

// Animação de entrada suave para elementos
document.addEventListener('DOMContentLoaded', function () {
    // Intersection Observer para // Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-dependent animations here
}, 16)); // ~60fps

// Função para melhorar alinhamento específico das seções
function improveSectionAlignment() {
    if (window.innerWidth > 768) {
        // Centralizar Missão, Visão e Valores
        const missionVisionValues = document.querySelector('.mission-vision-values');
        if (missionVisionValues) {
            const mvvItems = missionVisionValues.querySelectorAll('.mvv-item');
            if (mvvItems.length === 3) {
                // Garantir grid 3 colunas em desktop
                missionVisionValues.style.display = 'grid';
                missionVisionValues.style.gridTemplateColumns = 'repeat(3, minmax(280px, 350px))';
                missionVisionValues.style.justifyContent = 'center';
                missionVisionValues.style.gap = '2.5rem';
                missionVisionValues.style.maxWidth = '1200px';
                missionVisionValues.style.margin = '3rem auto 0';
                
                // Aplicar estilos aos items
                mvvItems.forEach(item => {
                    item.style.width = '100%';
                    item.style.maxWidth = '350px';
                    item.style.minHeight = '320px';
                    item.style.display = 'flex';
                    item.style.flexDirection = 'column';
                    item.style.justifyContent = 'flex-start';
                    item.style.alignItems = 'center';
                    item.style.textAlign = 'center';
                });
            }
        }
    }
}

// Executar melhorias de alinhamento quando a página carregar
document.addEventListener('DOMContentLoaded', improveSectionAlignment);
window.addEventListener('resize', debounce(improveSectionAlignment, 300));ações
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loading');
                }
            });
        },
        { threshold: 0.1 }
    );

    // Observar elementos para animação
    document.querySelectorAll('.service-card, .objection-item, .result-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });

    // Contador animado para estatísticas
    function animateNumbers() {
        const numbers = document.querySelectorAll('.stat-number, .metric-value');

        numbers.forEach(number => {
            const target = parseInt(number.textContent.replace(/\D/g, ''));
            if (target > 0) {
                let current = 0;
                const increment = target / 50; // 50 steps
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }

                    // Preserve original format
                    const originalText = number.textContent;
                    if (originalText.includes('+')) {
                        number.textContent = '+' + Math.floor(current);
                    } else if (originalText.includes('R$')) {
                        number.textContent = 'R$ ' + Math.floor(current);
                    } else if (originalText.includes('x')) {
                        number.textContent = (current / 10).toFixed(1) + 'x';
                    } else if (originalText.includes('%')) {
                        number.textContent = Math.floor(current) + '%';
                    } else {
                        number.textContent = Math.floor(current);
                    }
                }, 20);
            }
        });
    }

    // Trigger counter animation when section is visible
    const statsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    statsObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    // Smooth scroll para navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect para hero shapes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.shape');
        const speed = 0.5;

        parallax.forEach(element => {
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Loading states para formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;

                // Reset after 3 seconds if no other handling
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });

    // Adicionar efeito de hover nos cards
    document.querySelectorAll('.service-card, .result-card, .testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    updateUrgencyTimer();

    // WhatsApp button animation
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        setInterval(() => {
            whatsappBtn.classList.add('bounce');
            setTimeout(() => {
                whatsappBtn.classList.remove('bounce');
            }, 1000);
        }, 5000);
    }

    // Lazy loading for images that don't have native lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Performance optimizations
// Debounce function
function debounce(func, wait) {
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function () {
    // Scroll-dependent animations here
}, 16)); // ~60fps
