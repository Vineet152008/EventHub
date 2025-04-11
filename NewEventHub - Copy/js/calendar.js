/**
 * EventHub Calendar Script
 * Enhanced calendar rendering and interactions for EventHub
 */

document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
    setupViewToggle();
});

/**
 * Initialize the FullCalendar with enhanced styling and options
 */
function initCalendar() {
    const calendarEl = document.getElementById('calendarView');
    if (!calendarEl) return;
    
    // Get events data from the global variable or API
    const events = typeof eventsData !== 'undefined' ? eventsData : [];
    
    // Filter events to only include approved events
    const approvedEvents = events.filter(event => !event.status || event.status === 'approved');
    
    // Format events for calendar
    const calendarEvents = approvedEvents.map(event => {
        // Parse date strings
        const startDate = new Date(event.date);
        const endDate = new Date(event.date);
        endDate.setHours(endDate.getHours() + (event.duration || 2)); // Default 2-hour duration
        
        // Set event color based on type
        let backgroundColor;
        switch(event.type.toLowerCase()) {
            case 'cultural': backgroundColor = '#e74c3c'; break;
            case 'technical': backgroundColor = '#3498db'; break;
            case 'sports': backgroundColor = '#2ecc71'; break;
            case 'workshop': backgroundColor = '#9b59b6'; break;
            case 'seminar': backgroundColor = '#f39c12'; break;
            case 'educational': backgroundColor = '#1abc9c'; break;
            default: backgroundColor = '#3498db';
        }
        
        return {
            id: event.id,
            title: event.title,
            start: startDate,
            end: endDate,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            textColor: '#ffffff',
            extendedProps: {
                location: event.location,
                description: event.description,
                department: event.department,
                participants: event.participants || 0
            }
        };
    });
    
    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        buttonText: {
            today: 'Today',
            month: 'Month',
            week: 'Week',
            list: 'List'
        },
        themeSystem: 'standard',
        dayMaxEvents: true,
        events: calendarEvents,
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
        },
        eventClick: function(info) {
            // Open registration modal when clicking an event
            showEventDetails(info.event.id);
        },
        eventMouseEnter: function(info) {
            // Add hover animation class
            info.el.classList.add('fc-event-hover');
            
            // Create and show tooltip with event details
            const tooltip = document.createElement('div');
            tooltip.className = 'event-tooltip';
            tooltip.innerHTML = `
                <h4>${info.event.title}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${info.event.extendedProps.location}</p>
                <p><i class="fas fa-clock"></i> ${formatTime(info.event.start)} - ${formatTime(info.event.end)}</p>
                <p><i class="fas fa-users"></i> ${info.event.extendedProps.participants} participants</p>
                <small>Click for details</small>
            `;
            document.body.appendChild(tooltip);
            
            // Position tooltip near the event
            positionTooltip(tooltip, info.el);
            
            // Remove tooltip when mouse leaves
            info.el.addEventListener('mouseleave', function() {
                tooltip.remove();
                info.el.classList.remove('fc-event-hover');
            });
        },
        datesSet: function(dateInfo) {
            // Add animation for calendar view change
            calendarEl.classList.add('active');
            setTimeout(() => {
                calendarEl.classList.remove('active');
            }, 500);
        }
    });
    
    // Render the calendar
    calendar.render();
    
    // Store calendar instance for later use
    window.eventHubCalendar = calendar;
}

/**
 * Set up view toggle buttons for smooth transitions
 */
function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const calendarView = document.getElementById('calendarView');
    
    if (!viewButtons.length || !calendarView) return;
    
    viewButtons.forEach(btn => {
        if (btn.getAttribute('data-view') === 'calendar') {
            btn.addEventListener('click', function() {
                // Trigger resize on the calendar to fix any sizing issues
                setTimeout(() => {
                    if (window.eventHubCalendar) {
                        window.eventHubCalendar.updateSize();
                    }
                }, 350);
            });
        }
    });
}

/**
 * Show event details in the registration modal
 * @param {string} eventId - The ID of the event to display
 */
function showEventDetails(eventId) {
    const eventData = typeof eventsData !== 'undefined' ? 
        eventsData.find(event => event.id === eventId) : null;
    
    if (!eventData) return;
    
    // Update modal with event data
    const modal = document.getElementById('registrationModal');
    if (!modal) return;
    
    document.getElementById('eventTitle').textContent = eventData.title;
    document.getElementById('eventId').value = eventData.id;
    
    // Show the modal
    modal.style.display = 'flex';
}

/**
 * Format time for tooltip display
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string
 */
function formatTime(date) {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

/**
 * Position the tooltip near the event element
 * @param {HTMLElement} tooltip - The tooltip element
 * @param {HTMLElement} eventEl - The event element
 */
function positionTooltip(tooltip, eventEl) {
    const rect = eventEl.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    tooltip.style.position = 'absolute';
    tooltip.style.top = rect.top + scrollTop - tooltip.offsetHeight - 10 + 'px';
    tooltip.style.left = rect.left + scrollLeft + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.zIndex = 1000;
    
    // Add arrow pointing to the event
    tooltip.style.setProperty('--tooltip-arrow-left', tooltip.offsetWidth / 2 - 10 + 'px');
}

// Add tooltip styles dynamically
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .event-tooltip {
            background-color: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            max-width: 250px;
            pointer-events: none;
            animation: tooltip-fade-in 0.2s ease;
            position: relative;
        }
        
        .event-tooltip::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: var(--tooltip-arrow-left, 50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid white;
        }
        
        .event-tooltip h4 {
            margin: 0 0 8px;
            color: var(--dark-color);
            font-weight: 600;
        }
        
        .event-tooltip p {
            margin: 5px 0;
            font-size: 0.9rem;
            color: var(--gray-color);
        }
        
        .event-tooltip small {
            display: block;
            margin-top: 8px;
            font-size: 0.8rem;
            color: var(--primary-color);
            text-align: center;
            font-style: italic;
        }
        
        .event-tooltip i {
            margin-right: 5px;
            color: var(--primary-color);
        }
        
        .fc-event-hover {
            transform: scale(1.05) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
            z-index: 5 !important;
        }
        
        @keyframes tooltip-fade-in {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}); 