document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            }
        });
    });

    // Scroll reveal animation
    const scrollReveal = ScrollReveal({
        origin: 'bottom',
        distance: '60px',
        duration: 1000,
        delay: 200,
        reset: false
    });

    scrollReveal.reveal('.card, .col-md-4, .col-lg-3, .col-xl-3', { 
        interval: 200 
    });

    scrollReveal.reveal('.display-5, .lead', { 
        origin: 'left' 
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.classList.add('btn', 'btn-primary', 'back-to-top');
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.borderRadius = '50%';
    backToTopButton.style.width = '50px';
    backToTopButton.style.height = '50px';
    backToTopButton.style.display = 'none';
    backToTopButton.style.zIndex = '99';
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Simple ScrollReveal implementation
const ScrollReveal = (function() {
    function ScrollReveal(options) {
        this.options = options || {};
        this.defaults = {
            origin: 'bottom',
            distance: '20px',
            duration: 500,
            delay: 0,
            rotate: { x: 0, y: 0, z: 0 },
            opacity: 0,
            scale: 1,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            container: document.documentElement,
            mobile: true,
            reset: false,
            useDelay: 'always',
            viewFactor: 0.0,
            viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
            beforeReveal: function() {},
            afterReveal: function() {},
            beforeReset: function() {},
            afterReset: function() {}
        };
        
        this.config = Object.assign({}, this.defaults, this.options);
        this.elements = [];
        this.sequence = 0;
    }
    
    ScrollReveal.prototype.reveal = function(selector, config) {
        const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
        const revealConfig = config ? Object.assign({}, this.config, config) : this.config;
        
        Array.from(elements).forEach((el, i) => {
            const elementConfig = Object.assign({}, revealConfig);
            
            if (elementConfig.interval) {
                elementConfig.delay = i * elementConfig.interval;
            }
            
            this.elements.push({
                el: el,
                config: elementConfig,
                revealed: false
            });
            
            this.styleElement(el, elementConfig);
        });
        
        this.init();
        return this;
    };
    
    ScrollReveal.prototype.styleElement = function(el, config) {
        el.style.opacity = config.opacity !== undefined ? config.opacity : 0;
        el.style.transform = this.getTransform(config);
        el.style.transition = 'none';
    };
    
    ScrollReveal.prototype.getTransform = function(config) {
        let transform = '';
        
        if (config.origin === 'top') {
            transform += `translate3d(0, -${config.distance}, 0)`;
        } else if (config.origin === 'right') {
            transform += `translate3d(${config.distance}, 0, 0)`;
        } else if (config.origin === 'bottom') {
            transform += `translate3d(0, ${config.distance}, 0)`;
        } else if (config.origin === 'left') {
            transform += `translate3d(-${config.distance}, 0, 0)`;
        }
        
        if (config.rotate.x) {
            transform += ` rotateX(${config.rotate.x}deg)`;
        }
        
        if (config.rotate.y) {
            transform += ` rotateY(${config.rotate.y}deg)`;
        }
        
        if (config.rotate.z) {
            transform += ` rotateZ(${config.rotate.z}deg)`;
        }
        
        if (config.scale !== 1) {
            transform += ` scale(${config.scale})`;
        }
        
        return transform;
    };
    
    ScrollReveal.prototype.init = function() {
        if (this.elements.length === 0) return;
        
        if (!this.observer) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateIn(entry.target);
                    } else if (this.config.reset) {
                        this.animateOut(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            });
            
            this.elements.forEach(item => {
                this.observer.observe(item.el);
            });
        }
    };
    
    ScrollReveal.prototype.animateIn = function(el) {
        const element = this.elements.find(item => item.el === el);
        
        if (!element || element.revealed) return;
        
        element.revealed = true;
        const config = element.config;
        
        setTimeout(() => {
            el.style.transition = `
                opacity ${config.duration}ms ${config.easing} ${config.delay}ms,
                transform ${config.duration}ms ${config.easing} ${config.delay}ms
            `;
            
            el.style.opacity = 1;
            el.style.transform = 'translate3d(0, 0, 0) scale(1)';
            
            if (typeof config.beforeReveal === 'function') {
                config.beforeReveal(el);
            }
            
            const transitionEnd = () => {
                el.removeEventListener('transitionend', transitionEnd);
                
                if (typeof config.afterReveal === 'function') {
                    config.afterReveal(el);
                }
            };
            
            el.addEventListener('transitionend', transitionEnd);
        }, 10);
    };
    
    ScrollReveal.prototype.animateOut = function(el) {
        const element = this.elements.find(item => item.el === el);
        
        if (!element || !element.revealed) return;
        
        element.revealed = false;
        const config = element.config;
        
        el.style.transition = `
            opacity ${config.duration}ms ${config.easing},
            transform ${config.duration}ms ${config.easing}
        `;
        
        el.style.opacity = config.opacity !== undefined ? config.opacity : 0;
        el.style.transform = this.getTransform(config);
        
        if (typeof config.beforeReset === 'function') {
            config.beforeReset(el);
        }
        
        const transitionEnd = () => {
            el.removeEventListener('transitionend', transitionEnd);
            
            if (typeof config.afterReset === 'function') {
                config.afterReset(el);
            }
        };
        
        el.addEventListener('transitionend', transitionEnd);
    };
    
    return ScrollReveal;
})();