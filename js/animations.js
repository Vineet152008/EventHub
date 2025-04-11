/**
 * EventHub Animations Script
 * Handles scroll reveal animations and other animation effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add scroll reveal animations
    initScrollReveal();
    
    // Add hover animations to elements with hover classes
    initHoverAnimations();

    // Initialize event cards animations
    initEventCardsAnimation();
});

/**
 * Initialize Event Cards Animation
 * Animates event cards as they enter the viewport with staggered timing
 */
function initEventCardsAnimation() {
    const eventCards = document.querySelectorAll('.event-card');
    
    // If no event cards, exit
    if (eventCards.length === 0) return;
    
    // Add event title animation class
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle && sectionTitle.parentElement.classList.contains('events-section')) {
        sectionTitle.classList.add('events-title');
    }

    // Add staggered animations for view toggle buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach((btn, index) => {
        btn.style.animationDelay = `${0.3 + (index * 0.1)}s`;
        
        // Add click event handler for smooth view transitions
        btn.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            const gridView = document.getElementById('eventsContainer');
            const calendarView = document.getElementById('calendarView');
            
            // Remove active class from all buttons
            viewButtons.forEach(button => button.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Handle view transitions with animations
            if (viewType === 'grid') {
                // Fade out calendar
                if (calendarView.style.display === 'block') {
                    calendarView.style.opacity = '0';
                    setTimeout(() => {
                        calendarView.style.display = 'none';
                        // Fade in grid
                        gridView.style.display = 'grid';
                        setTimeout(() => {
                            gridView.style.opacity = '1';
                            // Re-trigger card animations
                            document.querySelectorAll('.event-card:not(.animate)').forEach(card => {
                                card.classList.add('animate');
                            });
                        }, 50);
                    }, 300);
                }
            } else if (viewType === 'calendar') {
                // Fade out grid
                gridView.style.opacity = '0';
                setTimeout(() => {
                    gridView.style.display = 'none';
                    // Fade in calendar
                    calendarView.style.display = 'block';
                    setTimeout(() => {
                        calendarView.style.opacity = '1';
                        // Trigger any calendar resize if needed
                        window.dispatchEvent(new Event('resize'));
                    }, 50);
                }, 300);
            }
        });
    });

    // Create a new Intersection Observer
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is in the viewport
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add('animate');
                // Stop observing it
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% visible
        rootMargin: '0px 0px -50px 0px' // slightly earlier
    });

    // Observe each event card
    eventCards.forEach(card => {
        cardObserver.observe(card);
    });
    
    // Add initial styling for view containers to enable transitions
    const gridView = document.getElementById('eventsContainer');
    const calendarView = document.getElementById('calendarView');
    
    if (gridView && calendarView) {
        gridView.style.transition = 'opacity 0.3s ease';
        calendarView.style.transition = 'opacity 0.3s ease';
        gridView.style.opacity = '1';
        calendarView.style.opacity = '0';
    }
}

/**
 * Initialize Scroll Reveal Animations
 * Adds reveal-active class to elements when they enter viewport
 */
function initScrollReveal() {
    // Select all elements with reveal classes
    const revealElements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-left, .reveal-right, .reveal-up');
    
    // Observer options
    const observerOptions = {
        root: null, // relative to viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of element is visible
    };
    
    // Create observer
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // stop observing once revealed
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Apply reveal classes to elements on page load
 * This function is called after page loads
 */
function applyRevealClasses() {
    // Apply to section titles
    document.querySelectorAll('.section-title').forEach((element, index) => {
        if (!element.classList.contains('reveal-up')) {
            element.classList.add('reveal-up');
        }
    });
    
    // Apply to event cards
    document.querySelectorAll('.event-card').forEach((element, index) => {
        if (!element.classList.contains('reveal-up')) {
            element.classList.add('reveal-up');
            // Add delay based on index for staggered effect
            element.style.transitionDelay = `${index * 0.1}s`;
        }
    });
    
    // Apply to how it works steps
    document.querySelectorAll('.step').forEach((element, index) => {
        if (!element.classList.contains('reveal-up')) {
            element.classList.add('reveal-up');
            // Add delay based on index for staggered effect
            element.style.transitionDelay = `${index * 0.15}s`;
        }
    });
    
    // Apply to featured events
    document.querySelectorAll('.featured-event').forEach((element, index) => {
        if (!element.classList.contains('reveal-right')) {
            element.classList.add('reveal-right');
            // Add delay based on index for staggered effect
            element.style.transitionDelay = `${index * 0.1}s`;
        }
    });
    
    // Apply to social media icons with pop effect
    document.querySelectorAll('.social-icons a').forEach((element, index) => {
        if (!element.classList.contains('reveal-up')) {
            element.classList.add('reveal-up');
            // Add delay based on index for staggered effect
            element.style.transitionDelay = `${index * 0.1}s`;
        }
    });
    
    // Apply to CTA section
    const ctaSection = document.querySelector('.cta-content');
    if (ctaSection && !ctaSection.classList.contains('reveal-fade')) {
        ctaSection.classList.add('reveal-fade');
    }
}

/**
 * Initialize hover animations
 * Adds hover animation classes to elements
 */
function initHoverAnimations() {
    // Add hover-grow to event cards if not already added in HTML
    document.querySelectorAll('.event-card').forEach(card => {
        if (!card.classList.contains('hover-grow') && !card.classList.contains('hover-shadow')) {
            card.classList.add('hover-shadow');
        }
    });
    
    // Add hover-pulse to primary buttons
    document.querySelectorAll('.primary-btn').forEach(btn => {
        if (!btn.classList.contains('hover-pulse')) {
            btn.classList.add('hover-pulse');
        }
    });
}

// Call applyRevealClasses after a short delay to ensure DOM is ready
setTimeout(() => {
    applyRevealClasses();
    // Re-initialize scroll reveal after applying classes
    initScrollReveal();
}, 100); 