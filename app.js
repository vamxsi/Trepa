// Trepa Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSliders();
    initModal();
    initScrollEffects();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('nav__menu--active');
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Handle different link types
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu) {
                        navMenu.classList.remove('nav__menu--active');
                    }
                }
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(26, 26, 26, 0.98)';
            } else {
                header.style.background = 'rgba(26, 26, 26, 0.95)';
            }
        }
    });
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('waitlistModal');
    const modalClose = document.getElementById('modalClose');
    const waitlistForm = document.getElementById('waitlistForm');
    
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    // All buttons that open the modal
    const modalTriggers = [
        document.getElementById('headerCta'),
        document.getElementById('heroJoinWaitlist'),
        document.getElementById('finalJoinWaitlist')
    ];

    // Open modal function
    function openModal(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log('Opening modal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    // Close modal function
    function closeModal() {
        console.log('Closing modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Attach event listeners to modal triggers
    modalTriggers.forEach((trigger, index) => {
        if (trigger) {
            console.log(`Attaching event listener to trigger ${index}`);
            trigger.addEventListener('click', openModal);
        } else {
            console.warn(`Modal trigger ${index} not found`);
        }
    });

    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Handle form submission
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const telegramInput = this.querySelector('input[type="text"]');
            
            const email = emailInput ? emailInput.value : '';
            const telegram = telegramInput ? telegramInput.value : '';
            
            if (email) {
                // Simulate form submission
                showSuccessMessage();
                closeModal();
                
                // Reset form
                this.reset();
            }
        });
    }

    function showSuccessMessage() {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'notification notification--success';
        notification.innerHTML = `
            <div class="notification__content">
                <h4>Welcome to the Trepa waitlist! 🎉</h4>
                <p>We'll notify you as soon as we launch. Get ready to monetize your social intuition!</p>
            </div>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #6B46C1 0%, #E879F9 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            max-width: 300px;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500);
        }, 5000);
    }
}

// Slider functionality
function initSliders() {
    // Hero demo slider
    initHeroSlider();
    
    // Solution section sliders
    initSolutionSliders();
}

function initHeroSlider() {
    const sliderThumb = document.getElementById('sliderThumb');
    const sliderFill = document.getElementById('sliderFill');
    const predictionValue = document.getElementById('predictionValue');
    const rewardValue = document.getElementById('rewardValue');
    
    if (!sliderThumb || !sliderFill) {
        console.warn('Hero slider elements not found');
        return;
    }

    let isDragging = false;
    let sliderRect = null;

    function updateSlider(percentage) {
        // Clamp percentage between 0 and 100
        percentage = Math.max(0, Math.min(100, percentage));
        
        // Update visual elements
        sliderThumb.style.left = percentage + '%';
        sliderFill.style.width = percentage + '%';
        
        // Calculate prediction value (3.0% to 6.0% range)
        const predictionVal = 3.0 + (percentage / 100) * 3.0;
        if (predictionValue) {
            predictionValue.textContent = predictionVal.toFixed(1) + '%';
        }
        
        // Calculate reward based on distance from actual (4.9%)
        const actualValue = 4.9;
        const distance = Math.abs(predictionVal - actualValue);
        const baseReward = 10; // Base reward percentage
        const accuracyBonus = Math.max(0, (1 - distance / 3) * 15); // Bonus for accuracy
        const totalReward = baseReward + accuracyBonus;
        
        if (rewardValue) {
            rewardValue.textContent = '+' + totalReward.toFixed(1) + '%';
        }
    }

    function startDrag(e) {
        isDragging = true;
        sliderRect = sliderThumb.parentElement.getBoundingClientRect();
        sliderThumb.style.cursor = 'grabbing';
        
        // Prevent text selection
        e.preventDefault();
    }

    function onDrag(e) {
        if (!isDragging || !sliderRect) return;
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const percentage = ((clientX - sliderRect.left) / sliderRect.width) * 100;
        updateSlider(percentage);
    }

    function endDrag() {
        isDragging = false;
        sliderRect = null;
        if (sliderThumb) {
            sliderThumb.style.cursor = 'grab';
        }
    }

    // Mouse events
    sliderThumb.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);

    // Touch events
    sliderThumb.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', endDrag);

    // Click on track to move slider
    const sliderTrack = sliderThumb.parentElement;
    if (sliderTrack) {
        sliderTrack.addEventListener('click', function(e) {
            if (e.target === sliderThumb) return;
            
            const rect = this.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            updateSlider(percentage);
        });
    }

    // Initialize with default value
    updateSlider(45);
}

function initSolutionSliders() {
    const confidenceSlider = document.getElementById('confidenceSlider');
    const stakeSlider = document.getElementById('stakeSlider');
    const confidenceValue = document.getElementById('confidenceValue');
    const stakeAmount = document.getElementById('stakeAmount');
    const potentialReward = document.getElementById('potentialReward');

    if (!confidenceSlider || !stakeSlider) {
        console.warn('Solution slider elements not found');
        return;
    }

    function updateReward() {
        const confidence = parseInt(confidenceSlider.value);
        const stake = parseInt(stakeSlider.value);
        
        // Update display values
        if (confidenceValue) {
            confidenceValue.textContent = confidence + '%';
        }
        if (stakeAmount) {
            stakeAmount.textContent = '$' + stake;
        }
        
        // Calculate potential reward based on confidence and stake
        const baseMultiplier = 1.5;
        const confidenceBonus = (confidence / 100) * 1.5;
        const totalMultiplier = baseMultiplier + confidenceBonus;
        const reward = (stake * totalMultiplier).toFixed(2);
        
        if (potentialReward) {
            potentialReward.textContent = '$' + reward;
        }
    }

    confidenceSlider.addEventListener('input', updateReward);
    stakeSlider.addEventListener('input', updateReward);

    // Initialize with default values
    updateReward();
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(`
        .feature-card,
        .achievement,
        .step,
        .comparison__item,
        .demo-card,
        .testimonial
    `);

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeInObserver.observe(element);
    });
}

// Add CSS animations via JavaScript
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .nav__menu--active {
            display: flex !important;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(26, 26, 26, 0.98);
            flex-direction: column;
            padding: 20px;
            border-top: 1px solid rgba(107, 70, 193, 0.2);
            gap: 16px;
        }
        
        @media (max-width: 768px) {
            .nav__menu {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize additional styles
addAnimationStyles();

// Utility functions
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

// Performance optimization for scroll events
const debouncedScrollHandler = debounce(function() {
    // Handle scroll-based animations here if needed
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const keyboardNavigationStyles = document.createElement('style');
keyboardNavigationStyles.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #00d4ff !important;
        outline-offset: 2px;
    }
`;
document.head.appendChild(keyboardNavigationStyles);

// Debug function to check if elements exist
function debugElements() {
    const elements = [
        'headerCta',
        'heroJoinWaitlist', 
        'finalJoinWaitlist',
        'waitlistModal'
    ];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            console.log(`✓ Found element: ${id}`);
        } else {
            console.warn(`✗ Missing element: ${id}`);
        }
    });
}

// Run debug in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(debugElements, 1000);
}