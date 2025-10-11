// Navigation functionality
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav-link');

// Show menu
if(navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show');
    });
}

// Hide menu
if(navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
}

// Remove menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav-link[href*=' + sectionId + ']');

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

// Testimonials Carousel
class TestimonialsCarousel {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.dotsContainer = document.getElementById('carousel-dots');
        this.currentSlide = 0;
        this.totalSlides = this.testimonials.length;
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.bindEvents();
        this.startAutoSlide();
    }
    
    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Pause auto-slide on hover
        const carousel = document.querySelector('.testimonials-carousel');
        carousel.addEventListener('mouseenter', () => this.stopAutoSlide());
        carousel.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    goToSlide(index) {
        // Remove active class from current slide and dot
        this.testimonials[this.currentSlide].classList.remove('active');
        this.dotsContainer.children[this.currentSlide].classList.remove('active');
        
        // Set new current slide
        this.currentSlide = index;
        
        // Add active class to new slide and dot
        this.testimonials[this.currentSlide].classList.add('active');
        this.dotsContainer.children[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Phone number formatting for Egyptian numbers
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message')
        };
        
        // Validate form
        if (!this.validateForm(data)) {
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = this.createWhatsAppMessage(data);
        const whatsappURL = `https://wa.me/201001234567?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Show success message
        this.showSuccessMessage();
        
        // Open WhatsApp
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
        }, 1000);
        
        // Reset form
        this.form.reset();
    }
    
    validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.service) {
            errors.push('Please select a service');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }
        
        return true;
    }
    
    createWhatsAppMessage(data) {
        return `Hello Wakel.io Team,\n\nI'm interested in your business development services.\n\nMy Details:\n• Name: ${data.name}\n• Email: ${data.email}\n• Phone: ${data.phone || 'Not provided'}\n• Service Interest: ${data.service}\n\nMessage:\n${data.message}\n\nI would like to schedule a consultation to discuss how Wakel.io can help grow my business.\n\nThank you!`;
    }
    
    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
        
        // If it doesn't start with +20, add it
        if (value && !value.startsWith('20')) {
            if (value.startsWith('0')) {
                value = '20' + value.substring(1);
            } else {
                value = '20' + value;
            }
        }
        
        // Format as +20 XXX XXX XXXX
        if (value.length >= 2) {
            value = '+' + value;
        }
        
        e.target.value = value;
    }
    
    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #25D366;
                color: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                max-width: 400px;
                width: 90%;
            ">
                <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>Message Sent Successfully!</h3>
                <p>We'll redirect you to WhatsApp to continue the conversation.</p>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 3000);
    }
    
    showErrors(errors) {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #EF4444;
                color: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                max-width: 400px;
                width: 90%;
            ">
                <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3>Please Fix These Errors:</h3>
                <ul style="text-align: left; margin: 1rem 0;">
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                ">Close</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Smooth scrolling for anchor links
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation on scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animatedElements = document.querySelectorAll(
        '.service-card, .step, .blog-card, .testimonial, .stat'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Loading animation
function showLoadingAnimation() {
    const body = document.body;
    body.style.overflow = 'hidden';
    
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #1E3A8A;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            flex-direction: column;
            color: white;
        ">
            <h2 style="margin-bottom: 2rem; font-family: 'Poppins', sans-serif;">Wakel.io</h2>
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid rgba(245, 158, 11, 0.3);
                border-top: 3px solid #F59E0B;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.removeChild(loader);
            body.style.overflow = 'auto';
        }, 500);
    }, 1500);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    showLoadingAnimation();
    
    // Initialize components after loading
    setTimeout(() => {
        new TestimonialsCarousel();
        new ContactForm();
        smoothScroll();
        animateOnScroll();
    }, 1600);
});

// Performance optimization: Debounced scroll handler
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

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(scrollActive, 100));

// Page visibility API for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any animations or intervals when page is not visible
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel && carousel.carousel) {
            carousel.carousel.stopAutoSlide();
        }
    } else {
        // Resume when page becomes visible
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel && carousel.carousel) {
            carousel.carousel.startAutoSlide();
        }
    }
});