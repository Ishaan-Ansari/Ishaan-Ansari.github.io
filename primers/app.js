// Blog Template JavaScript - Fixed Version

class BlogTemplate {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupNewsletterForm();
        this.setupImageLoading();
        this.setupScrollEffects();
        this.setupInteractiveElements();
        this.loadUserPreferences();
    }

    // Theme Toggle Functionality - FIXED
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        
        // Set initial theme based on system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = prefersDark ? 'dark' : 'light';
        this.setTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
                
                // Show feedback
                this.showNotification(`Switched to ${newTheme} mode`, 'success');
            });
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.setTheme(e.matches ? 'dark' : 'light');
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-color-scheme', theme);
        document.body.setAttribute('data-theme', theme);
        
        // Update theme toggle button aria-label
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 
                theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
            );
        }
    }

    // Mobile Navigation - FIXED
    setupMobileNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav__link');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('show');
                
                // Update aria-expanded
                const isExpanded = navMenu.classList.contains('show');
                navToggle.setAttribute('aria-expanded', isExpanded);
            });

            // Close mobile menu when clicking on nav links
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('show');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('show');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Smooth Scrolling for Navigation Links - FIXED
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
        const heroButtons = document.querySelectorAll('.hero__actions .btn[href^="#"]');
        
        [...navLinks, ...heroButtons].forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                // Handle different section mappings
                let targetElement;
                if (targetId === '#home') {
                    targetElement = document.querySelector('.hero');
                } else if (targetId === '#blog') {
                    targetElement = document.querySelector('.featured-posts');
                } else if (targetId === '#about') {
                    targetElement = document.querySelector('.about');
                } else if (targetId === '#contact') {
                    targetElement = document.querySelector('.footer');
                } else {
                    targetElement = document.querySelector(targetId);
                }
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Show feedback
                    this.showNotification(`Navigated to ${targetId.replace('#', '')} section`, 'info');
                }
            });
        });
    }

    // Newsletter Form - FIXED
    setupNewsletterForm() {
        const newsletterForm = document.getElementById('newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                const submitButton = newsletterForm.querySelector('button[type="submit"]');
                
                if (emailInput && submitButton) {
                    const email = emailInput.value.trim();
                    
                    if (this.validateEmail(email)) {
                        await this.handleNewsletterSubscription(emailInput, submitButton);
                    } else {
                        this.showFormError(emailInput, 'Please enter a valid email address');
                    }
                }
            });
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async handleNewsletterSubscription(emailInput, submitButton) {
        const originalButtonText = submitButton.textContent;
        const email = emailInput.value;
        
        // Update button state
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;
        emailInput.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success state
            submitButton.textContent = 'Subscribed!';
            submitButton.style.background = 'var(--color-success)';
            emailInput.value = '';
            
            // Show success message
            this.showNotification(`Successfully subscribed ${email} to the newsletter!`, 'success');
            
            // Reset button after delay
            setTimeout(() => {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                emailInput.disabled = false;
                submitButton.style.background = '';
            }, 3000);
            
        } catch (error) {
            // Error state
            submitButton.textContent = 'Try Again';
            submitButton.disabled = false;
            emailInput.disabled = false;
            
            this.showNotification('Failed to subscribe. Please try again.', 'error');
            
            setTimeout(() => {
                submitButton.textContent = originalButtonText;
            }, 3000);
        }
    }

    // Interactive Elements Setup - NEW
    setupInteractiveElements() {
        // Search button functionality
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Search functionality - Enter keywords to search articles', 'info');
            });
        }

        // Blog post cards clickability
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach((card, index) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    e.preventDefault();
                    const title = card.querySelector('.post-card__title a').textContent;
                    this.showNotification(`Opening: "${title}"`, 'info');
                }
            });
        });

        // View All Posts button
        const viewAllBtn = document.querySelector('.section__footer .btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Loading all blog posts...', 'info');
            });
        }

        // Social media links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach((link, index) => {
            const platforms = ['GitHub', 'LinkedIn', 'Twitter', 'Email'];
            const platform = platforms[index % platforms.length];
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification(`Opening ${platform} profile`, 'info');
            });
        });

        // Category tags click
        const categoryTags = document.querySelectorAll('.post-card__category');
        categoryTags.forEach(tag => {
            tag.style.cursor = 'pointer';
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showNotification(`Filtering posts by: ${tag.textContent}`, 'info');
            });
        });

        // Post title links
        const postTitleLinks = document.querySelectorAll('.post-card__title a');
        postTitleLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showNotification(`Reading: "${link.textContent}"`, 'info');
            });
        });
    }

    showFormError(input, message) {
        // Remove existing error
        const existingError = input.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error styling
        input.style.borderColor = 'var(--color-error)';
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-sm);
            margin-top: var(--space-4);
        `;
        
        input.parentNode.appendChild(errorElement);
        
        // Remove error on input
        const removeError = () => {
            input.style.borderColor = '';
            const error = input.parentNode.querySelector('.form-error');
            if (error) error.remove();
            input.removeEventListener('input', removeError);
        };
        
        input.addEventListener('input', removeError);
    }

    // Image Loading with Progressive Enhancement
    setupImageLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                
                img.addEventListener('error', () => {
                    // Handle image load error with a fallback
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZjVmNWY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDIyNVYxNTBIMTc1VjEwMFoiIGZpbGw9IiNkZGRkZGQiLz4KPHBhdGggZD0iTTE1MCAyMDBIMjUwVjEyNUgxNTBWMjAwWiIgZmlsbD0iI2RkZGRkZCIvPgo8L3N2Zz4K';
                    img.classList.add('loaded');
                });
            }
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;
        
        if (header) {
            const scrollHandler = this.throttle(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Add/remove scrolled class for header styling
                if (scrollTop > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                lastScrollTop = scrollTop;
            }, 16);
            
            window.addEventListener('scroll', scrollHandler);
        }
        
        // Animate elements on scroll
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.post-card, .hero__content, .about__content');
        
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease-out';
                animationObserver.observe(el);
            });
        }
    }

    // Load User Preferences
    loadUserPreferences() {
        // Load saved scroll position for back button navigation
        if (performance.navigation && performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
            const savedPosition = sessionStorage.getItem('scrollPosition');
            if (savedPosition) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedPosition));
                }, 100);
            }
        }
        
        // Save scroll position before leaving
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('scrollPosition', window.pageYOffset.toString());
        });
    }

    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        const colors = {
            success: 'var(--color-success)',
            error: 'var(--color-error)',
            info: 'var(--color-primary)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-surface);
            color: var(--color-text);
            padding: var(--space-16) var(--space-20);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            border-left: 4px solid ${colors[type] || colors.info};
            z-index: 10000;
            transform: translateX(100%);
            transition: transform var(--duration-normal) var(--ease-standard);
            max-width: 300px;
            font-size: var(--font-size-sm);
            line-height: 1.4;
            cursor: pointer;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 4000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    // Utility Methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the blog template when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BlogTemplate();
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu and notifications
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu && navMenu.classList.contains('show')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('show');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Close notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
});