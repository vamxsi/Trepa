// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const predictionSlider = document.getElementById('predictionSlider');
const sliderValue = document.getElementById('sliderValue');
const payoutAmount = document.getElementById('payoutAmount');
const emailInput = document.getElementById('emailInput');
const signupButton = document.getElementById('signupButton');
const mainCTA = document.getElementById('mainCTA');

// Navigation Toggle
function initNavigation() {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });
}

// Prediction Slider Functionality
function initPredictionSlider() {
    function updateSliderValue() {
        const value = predictionSlider.value;
        sliderValue.textContent = `${value}%`;
        
        // Update slider position for the value display
        const percentage = (value - predictionSlider.min) / (predictionSlider.max - predictionSlider.min) * 100;
        sliderValue.style.left = `${percentage}%`;
        
        // Calculate dynamic payout based on prediction
        const payout = calculatePayout(value);
        payoutAmount.textContent = `$${payout}`;
        
        // Update slider track color
        const sliderTrack = predictionSlider.style;
        sliderTrack.background = `linear-gradient(to right, #00f5ff 0%, #00f5ff ${percentage}%, #2a2a38 ${percentage}%, #2a2a38 100%)`;
    }

    function calculatePayout(prediction) {
        // Simulate realistic payout calculation
        const baseAmount = 10;
        const confidenceMultiplier = Math.abs(50 - prediction) / 50; // Distance from 50%
        const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        const payout = baseAmount * (1 + confidenceMultiplier) * randomFactor;
        return payout.toFixed(2);
    }

    predictionSlider.addEventListener('input', updateSliderValue);
    predictionSlider.addEventListener('change', updateSliderValue);
    
    // Initialize slider
    updateSliderValue();
}

// Smooth Scroll Animation
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Special animations for specific elements
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
                
                if (entry.target.classList.contains('accuracy-fill')) {
                    entry.target.style.width = entry.target.getAttribute('data-width') || entry.target.style.width;
                }
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(`
        .step-card,
        .feature-card,
        .testimonial-card,
        .comparison-card,
        .stat-item,
        .accuracy-case,
        .prediction-card
    `);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Counter Animation
function animateCounter(element) {
    const numberElement = element.querySelector('.stat-number');
    if (!numberElement) return;

    const finalNumber = numberElement.textContent;
    const numericValue = parseInt(finalNumber.replace(/[^0-9]/g, ''));
    const suffix = finalNumber.replace(/[0-9]/g, '');
    
    let currentNumber = 0;
    const increment = numericValue / 30; // 30 frames
    
    const counter = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= numericValue) {
            numberElement.textContent = finalNumber;
            clearInterval(counter);
        } else {
            numberElement.textContent = Math.floor(currentNumber) + suffix;
        }
    }, 50);
}

// Email Signup
function initEmailSignup() {
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showMessage(message, isError = false) {
        // Remove existing messages
        const existingMessage = document.querySelector('.signup-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageEl = document.createElement('div');
        messageEl.className = `signup-message ${isError ? 'error' : 'success'}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            margin-top: 12px;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            font-weight: 500;
            transition: all 0.3s ease;
            ${isError ? 
                'background: rgba(255, 68, 68, 0.1); color: #ff4444; border: 1px solid rgba(255, 68, 68, 0.2);' : 
                'background: rgba(57, 255, 20, 0.1); color: #39ff14; border: 1px solid rgba(57, 255, 20, 0.2);'
            }
        `;

        const formGroup = document.querySelector('.form-group');
        formGroup.parentNode.insertBefore(messageEl, formGroup.nextSibling);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.opacity = '0';
                messageEl.style.transform = 'translateY(-10px)';
                setTimeout(() => messageEl.remove(), 300);
            }
        }, 5000);
    }

    function handleSignup() {
        const email = emailInput.value.trim();
        
        if (!email) {
            showMessage('Please enter your email address', true);
            emailInput.focus();
            return;
        }

        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address', true);
            emailInput.focus();
            return;
        }

        // Show loading state
        const originalText = signupButton.textContent;
        signupButton.textContent = 'Joining...';
        signupButton.disabled = true;
        signupButton.style.opacity = '0.7';

        // Simulate API call
        setTimeout(() => {
            showMessage('🎉 Welcome to the Trepa beta! Check your email for next steps.');
            emailInput.value = '';
            
            // Reset button
            signupButton.textContent = originalText;
            signupButton.disabled = false;
            signupButton.style.opacity = '1';

            // Track conversion (in real app, you'd send this to analytics)
            console.log('Beta signup:', email);
        }, 1500);
    }

    signupButton.addEventListener('click', handleSignup);
    
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    });

    // Main CTA also triggers signup
    mainCTA.addEventListener('click', () => {
        const signupSection = document.querySelector('.final-cta');
        signupSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            emailInput.focus();
        }, 800);
    });
}

// Interactive Step Cards
function initStepCards() {
    const stepCards = document.querySelectorAll('.step-card');
    
    stepCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            // Add special hover effects for each step
            if (index === 0) {
                // Slide step - animate the slider
                const slider = card.querySelector('.demo-range');
                if (slider) {
                    let currentValue = parseInt(slider.value);
                    const targetValue = 75;
                    const animateSlider = () => {
                        if (currentValue < targetValue) {
                            currentValue += 2;
                            slider.value = currentValue;
                            requestAnimationFrame(animateSlider);
                        }
                    };
                    animateSlider();
                }
            } else if (index === 1) {
                // Stake step - animate coins
                const coins = card.querySelectorAll('.coin');
                coins.forEach((coin, coinIndex) => {
                    setTimeout(() => {
                        coin.style.transform = 'translateY(-15px) scale(1.1)';
                        setTimeout(() => {
                            coin.style.transform = 'translateY(0) scale(1)';
                        }, 300);
                    }, coinIndex * 100);
                });
            } else if (index === 2) {
                // Show off step - highlight leaderboard
                const leaderboardItems = card.querySelectorAll('.leaderboard-item');
                leaderboardItems.forEach((item, itemIndex) => {
                    setTimeout(() => {
                        item.style.background = 'rgba(0, 245, 255, 0.1)';
                        item.style.transform = 'scale(1.02)';
                    }, itemIndex * 150);
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            // Reset animations
            const slider = card.querySelector('.demo-range');
            if (slider) {
                slider.value = 65;
            }
            
            const coins = card.querySelectorAll('.coin');
            coins.forEach(coin => {
                coin.style.transform = 'translateY(0) scale(1)';
            });
            
            const leaderboardItems = card.querySelectorAll('.leaderboard-item');
            leaderboardItems.forEach(item => {
                item.style.background = 'var(--trepa-bg-tertiary)';
                item.style.transform = 'scale(1)';
            });
        });
    });
}

// Floating Cards Animation
function initFloatingCards() {
    const cards = document.querySelectorAll('.prediction-card');
    
    cards.forEach((card, index) => {
        // Random gentle movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            
            card.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + index * 500);
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.nav');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.style.background = 'rgba(10, 10, 15, 0.95)';
            nav.style.backdropFilter = 'blur(30px)';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.9)';
            nav.style.backdropFilter = 'blur(20px)';
        }
        
        // Hide navbar on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Interactive Demo Sliders in Steps
function initStepSliders() {
    const stepSliders = document.querySelectorAll('.demo-range');
    
    stepSliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const value = this.value;
            const min = this.min || 0;
            const max = this.max || 100;
            const percentage = ((value - min) / (max - min)) * 100;
            
            this.style.background = `linear-gradient(to right, #00f5ff 0%, #00f5ff ${percentage}%, #2a2a38 ${percentage}%, #2a2a38 100%)`;
        });
        
        // Initialize
        slider.dispatchEvent(new Event('input'));
    });
}

// Testimonial Cards Rotation
function initTestimonialRotation() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    // Add subtle highlighting effect every few seconds
    setInterval(() => {
        testimonialCards.forEach(card => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        });
        
        const currentCard = testimonialCards[currentIndex];
        currentCard.style.transform = 'scale(1.02)';
        currentCard.style.boxShadow = '0 20px 40px rgba(0, 245, 255, 0.2)';
        
        currentIndex = (currentIndex + 1) % testimonialCards.length;
    }, 4000);
}

// Particle Effect for Hero Background
function initParticleEffect() {
    const heroSection = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 245, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${5 + Math.random() * 10}s linear infinite;
        `;
        
        heroSection.appendChild(particle);
    }
    
    // Add CSS animation for particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization for mobile
function initMobileOptimizations() {
    if (window.innerWidth <= 768) {
        // Reduce particle count on mobile
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 20) {
                particle.remove();
            }
        });
        
        // Reduce animation intensity
        const floatingCards = document.querySelectorAll('.prediction-card');
        floatingCards.forEach(card => {
            card.style.animation = 'none';
        });
    }
}

// Initialize all functionality
function init() {
    // Check if DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    console.log('🚀 Trepa landing page initialized');
    
    try {
        initNavigation();
        initPredictionSlider();
        initSmoothScroll();
        initScrollAnimations();
        initEmailSignup();
        initStepCards();
        initFloatingCards();
        initNavbarScroll();
        initStepSliders();
        initTestimonialRotation();
        initParticleEffect();
        initMobileOptimizations();
        
        console.log('✅ All features initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing features:', error);
    }
}

// Error handling for missing elements
function safeElementOperation(selector, operation) {
    const element = document.querySelector(selector);
    if (element) {
        operation(element);
    } else {
        console.warn(`Element not found: ${selector}`);
    }
}

// Utility function for smooth animations
function animateValue(obj, start, end, duration, callback) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        
        if (callback) callback(value);
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Analytics tracking (placeholder - replace with actual analytics)
function trackEvent(eventName, properties = {}) {
    console.log('📊 Event tracked:', eventName, properties);
    // In production, replace with actual analytics calls:
    // gtag('event', eventName, properties);
    // mixpanel.track(eventName, properties);
}

// Initialize the application
init();

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// Export functions for potential external use
window.TrepaLanding = {
    trackEvent,
    animateValue,
    init
};