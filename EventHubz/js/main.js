// DOM Elements
const eventsContainer = document.getElementById('eventsContainer');
const calendarView = document.getElementById('calendarView');
const featuredTrack = document.getElementById('featuredTrack');
const notificationCount = document.querySelector('.notification-count');
const notificationList = document.getElementById('notificationList');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const typeFilter = document.getElementById('typeFilter');
const dateFilter = document.getElementById('dateFilter');
const departmentFilter = document.getElementById('departmentFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const viewButtons = document.querySelectorAll('.view-btn');
const mobileToggle = document.querySelector('.mobile-toggle');
const mainNav = document.querySelector('.main-nav');
const registrationModal = document.getElementById('registrationModal');
const successModal = document.getElementById('successModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const registrationForm = document.getElementById('registrationForm');
const eventTitleSpan = document.getElementById('eventTitle');
const eventIdInput = document.getElementById('eventId');
const downloadEPassBtn = document.getElementById('downloadEPass');
const ePassPreview = document.getElementById('ePassPreview');

// Global Variables
let currentEvents = [...eventsData];
let currentPage = 1;
const eventsPerPage = 6;
let calendar = null;

// Initialize the application
function init() {
    // Filter events to only show approved events
    currentEvents = eventsData.filter(event => !event.status || event.status === 'approved');
    renderEvents(currentEvents, currentPage);
    setupEventListeners();
    initializeCalendar();
    initializeFeaturedSlider();
    updateNotifications();
    
    // Fix missing images
    setTimeout(fixMissingImages, 100);
}

// Render Events in Grid/List View
function renderEvents(events, page) {
    const startIndex = (page - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const paginatedEvents = events.slice(startIndex, endIndex);
    
    // Clear events container
    eventsContainer.innerHTML = '';
    
    if (paginatedEvents.length === 0) {
        eventsContainer.innerHTML = '<p class="no-events">No events match your search criteria</p>';
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    paginatedEvents.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
    
    // Show/hide load more button
    if (endIndex >= events.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }
    
    // Add fade-in animation to event cards
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Create Event Card
function createEventCard(event) {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.style.opacity = '0';
    eventCard.style.transform = 'translateY(20px)';
    eventCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    // Format event date for display
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Get department name from department ID
    const department = departments.find(dept => dept.id === event.department);
    const departmentName = department ? department.name : 'All Departments';
    
    // Get event type name from type ID
    const eventType = eventTypes.find(type => type.id === event.type);
    const eventTypeName = eventType ? eventType.name : 'Event';
    const eventTypeClass = event.type || 'event';

    // Generate random number of participants for demo purposes
    const participantCount = Math.floor(Math.random() * 30) + 5;
    
    // Create avatar HTML
    const avatarHTML = generateParticipantAvatars(participantCount);
    
    eventCard.innerHTML = `
        <div class="event-image">
            <img src="${event.image}" alt="${event.title}" loading="lazy" onerror="this.onerror=null; generateDynamicImage(this, '${eventTypeName}');">
            <span class="event-type ${eventTypeClass}">${eventTypeName}</span>
        </div>
        <div class="event-details">
            <div class="event-date">
                <i class="fas fa-calendar-alt"></i> ${formattedDate} | ${event.time}
            </div>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-location">
                <i class="fas fa-map-marker-alt"></i> ${event.location}
            </div>
            <p class="event-description">${truncateText(event.description, 100)}</p>
            <div class="event-participants">
                <div class="participant-avatars">
                    ${avatarHTML}
                </div>
                <span class="participant-count">${participantCount} participants</span>
            </div>
            <div class="event-footer">
                <span class="department">${departmentName}</span>
                <button class="btn primary-btn register-btn" data-event-id="${event.id}">Register</button>
            </div>
        </div>
    `;
    
    // Add event listener to register button
    const registerBtn = eventCard.querySelector('.register-btn');
    registerBtn.addEventListener('click', () => openRegistrationModal(event));
    
    return eventCard;
}

// Function to generate participant avatars
function generateParticipantAvatars(count) {
    // Show max 4 avatars
    const maxAvatars = 4;
    let avatarsHTML = '';
    
    for (let i = 0; i < Math.min(maxAvatars, count); i++) {
        // Random avatar image - using placeholder avatars
        const avatarIndex = Math.floor(Math.random() * 8) + 1;
        avatarsHTML += `
            <div class="participant-avatar">
                <img src="../images/avatar${avatarIndex}.jpg" alt="Participant" onerror="this.src='https://ui-avatars.com/api/?name=User&background=random'">
            </div>
        `;
    }
    
    return avatarsHTML;
}

// Function to generate dynamic image for an img element
function generateDynamicImage(imgElement, eventType) {
    // Default if eventType is undefined
    eventType = eventType || 'event';
    
    // Create a canvas for the dynamic background
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');
    
    // Get background color based on event type
    const colors = {
        'technical': '#3498db', // Blue
        'cultural': '#e74c3c',  // Red
        'workshop': '#9b59b6',  // Purple
        'sports': '#2ecc71',    // Green
        'seminar': '#f39c12',   // Orange
        'educational': '#1abc9c' // Teal
    };
    
    const bgColor = colors[eventType.toLowerCase()] || '#3498db';
    
    // Fill background with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(1, adjustColor(bgColor, -30)); // Darker shade
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add decorative circles for visual interest
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 70 + 30;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Add icon based on event type
    const icons = {
        'technical': '💻',
        'cultural': '🎭',
        'workshop': '🔧',
        'sports': '🏆',
        'seminar': '📢',
        'educational': '📚'
    };
    
    const icon = icons[eventType.toLowerCase()] || '📅';
    
    // Draw icon in the center
    ctx.font = '80px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, canvas.width / 2, canvas.height / 2);
    
    // Set the image data URL
    imgElement.src = canvas.toDataURL('image/png');
}

// Render Featured Events
function renderFeaturedEvents() {
    featuredTrack.innerHTML = '';
    
    featuredEvents.forEach(event => {
        const featuredEvent = document.createElement('div');
        featuredEvent.className = 'featured-event';
        
        // Get event type name from type ID
        const eventType = eventTypes.find(type => type.id === event.type);
        const eventTypeName = eventType ? eventType.name : 'Event';
        const eventTypeClass = event.type || 'event';
        
        // Generate random number of participants for demo purposes
        const participantCount = Math.floor(Math.random() * 30) + 5;
        
        // Create avatar HTML
        const avatarHTML = generateParticipantAvatars(participantCount);
        
        featuredEvent.innerHTML = `
            <div class="event-card">
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}" loading="lazy" onerror="this.onerror=null; generateDynamicImage(this, '${eventTypeName}');">
                    <span class="event-type ${eventTypeClass}">${eventTypeName}</span>
                </div>
                <div class="event-details">
                    <div class="event-date">
                        <i class="fas fa-calendar-alt"></i> ${formatDate(event.date)} | ${event.time}
                    </div>
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i> ${event.location}
                    </div>
                    <p class="event-description">${truncateText(event.description, 80)}</p>
                    <div class="event-participants">
                        <div class="participant-avatars">
                            ${avatarHTML}
                        </div>
                        <span class="participant-count">${participantCount} participants</span>
                    </div>
                    <div class="event-footer">
                        <button class="btn primary-btn register-btn" data-event-id="${event.id}">Register</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listener to register button
        const registerBtn = featuredEvent.querySelector('.register-btn');
        registerBtn.addEventListener('click', () => openRegistrationModal(event));
        
        featuredTrack.appendChild(featuredEvent);
    });
    
    // Add featured slider controls
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentPosition = 0;
    
    nextBtn.addEventListener('click', () => {
        if (currentPosition > -(featuredEvents.length - 3) * 380) {
            currentPosition -= 380;
            featuredTrack.style.transform = `translateX(${currentPosition}px)`;
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentPosition < 0) {
            currentPosition += 380;
            featuredTrack.style.transform = `translateX(${currentPosition}px)`;
        }
    });
}

// Initialize Featured Events Slider
function initializeFeaturedSlider() {
    if (featuredTrack) {
        // Check if there are featured events
        if (featuredEvents && featuredEvents.length > 0) {
            renderFeaturedEvents();
            
            // Make featured section visible (in case it was hidden)
            const featuredSection = document.querySelector('.featured-section');
            if (featuredSection) {
                featuredSection.style.display = 'block';
            }
        } else {
            // Hide featured section if no featured events
            const featuredSection = document.querySelector('.featured-section');
            if (featuredSection) {
                featuredSection.style.display = 'none';
            }
        }
    }
}

// Add function to fix missing images
function fixMissingImages() {
    // Get all event images
    const images = document.querySelectorAll('.event-image img');
    
    // Add error handler to replace missing images with colorful backgrounds
    images.forEach(img => {
        img.onerror = function() {
            // Get event details
            const eventCard = this.closest('.event-card');
            let eventTitle = this.alt || 'Event';
            let eventType = 'event';
            
            if (eventCard) {
                const typeElement = eventCard.querySelector('.event-type');
                if (typeElement) {
                    eventType = typeElement.textContent.trim().toLowerCase();
                }
            }
            
            // Create a canvas for the dynamic background
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 250;
            const ctx = canvas.getContext('2d');
            
            // Get background color based on event type
            const colors = {
                'technical': '#3498db', // Blue
                'cultural': '#e74c3c',  // Red
                'workshop': '#9b59b6',  // Purple
                'sports': '#2ecc71',    // Green
                'seminar': '#f39c12',   // Orange
                'educational': '#1abc9c' // Teal
            };
            
            const bgColor = colors[eventType.toLowerCase()] || '#3498db';
            
            // Fill background with gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, bgColor);
            gradient.addColorStop(1, adjustColor(bgColor, -30)); // Darker shade
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add texture/pattern
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            for (let i = 0; i < 5; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = Math.random() * 70 + 30;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Add icon based on event type
            const icons = {
                'technical': '💻',
                'cultural': '🎭',
                'workshop': '🔧',
                'sports': '🏆',
                'seminar': '📢',
                'educational': '📚'
            };
            
            const icon = icons[eventType.toLowerCase()] || '📅';
            
            // Draw icon in the center
            ctx.font = '80px Arial, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(icon, canvas.width / 2, canvas.height / 2);
            
            // Set the image data URL
            this.src = canvas.toDataURL('image/png');
        };
    });
    
    // Create event logos for the existing loaded events
    createEventLogos();
}

// Helper function to adjust color brightness
function adjustColor(hex, percent) {
    // Convert hex to RGB
    let r = parseInt(hex.substr(1, 2), 16);
    let g = parseInt(hex.substr(3, 2), 16);
    let b = parseInt(hex.substr(5, 2), 16);

    // Adjust each channel
    r = Math.max(0, Math.min(255, r + percent));
    g = Math.max(0, Math.min(255, g + percent));
    b = Math.max(0, Math.min(255, b + percent));

    // Convert back to hex
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Create text-based logos for events
function createEventLogos() {
    // Find all event images with blank or placeholder src
    const images = document.querySelectorAll('.event-image img');
    
    images.forEach(img => {
        // Check if the image is a placeholder or not loaded
        if (!img.complete || img.naturalHeight === 0 || 
            img.src.includes('placeholder') || 
            img.src.startsWith('data:')) {
            
            // Get event details
            const eventCard = img.closest('.event-card');
            if (!eventCard) return;
            
            let eventTitle = img.alt || 'Event';
            let eventType = 'event';
            
            const typeElement = eventCard.querySelector('.event-type');
            if (typeElement) {
                eventType = typeElement.textContent.trim().toLowerCase();
            }
            
            // Create a canvas for the dynamic background
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 250;
            const ctx = canvas.getContext('2d');
            
            // Get background color based on event type
            const colors = {
                'technical': '#3498db', // Blue
                'cultural': '#e74c3c',  // Red
                'workshop': '#9b59b6',  // Purple
                'sports': '#2ecc71',    // Green
                'seminar': '#f39c12',   // Orange
                'educational': '#1abc9c' // Teal
            };
            
            const bgColor = colors[eventType.toLowerCase()] || '#3498db';
            
            // Fill background with gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, bgColor);
            gradient.addColorStop(1, adjustColor(bgColor, -30)); // Darker shade
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add decorative circles for visual interest
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            for (let i = 0; i < 5; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = Math.random() * 70 + 30;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Add icon based on event type
            const icons = {
                'technical': '💻',
                'cultural': '🎭',
                'workshop': '🔧',
                'sports': '🏆',
                'seminar': '📢',
                'educational': '📚'
            };
            
            const icon = icons[eventType.toLowerCase()] || '📅';
            
            // Draw icon in the center
            ctx.font = '80px Arial, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(icon, canvas.width / 2, canvas.height / 2);
            
            // Set the image data URL
            img.src = canvas.toDataURL('image/png');
        }
    });
}

// Update Notifications
function updateNotifications() {
    const unreadCount = notificationsData.filter(notification => !notification.read).length;
    notificationCount.textContent = unreadCount > 0 ? "1" : "0";
    
    if (notificationsData.length === 0) {
        notificationList.innerHTML = '<p class="empty-notification">No new notifications</p>';
        return;
    }
    
    // Show only the most recent notification
    notificationList.innerHTML = '';
    
    // Get the most recent notification (first one in the array since notifications are added with unshift)
    const latestNotification = notificationsData[0];
    
    const notificationItem = document.createElement('div');
    notificationItem.className = `notification-item ${latestNotification.read ? 'read' : 'unread'}`;
    
    notificationItem.innerHTML = `
        <h4>${latestNotification.title}</h4>
        <p>${latestNotification.message}</p>
        <span class="notification-time">${latestNotification.time}</span>
    `;
    
    notificationItem.addEventListener('click', () => {
        latestNotification.read = true;
        updateNotifications();
    });
    
    notificationList.appendChild(notificationItem);
}

// Initialize Calendar
function initializeCalendar() {
    const calendarEl = document.getElementById('calendarView');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: eventsData.map(event => ({
            id: event.id.toString(),
            title: event.title,
            start: event.date,
            allDay: true,
            backgroundColor: getEventTypeColor(event.type),
            extendedProps: {
                location: event.location,
                description: event.description
            }
        })),
        eventClick: function(info) {
            const eventId = parseInt(info.event.id);
            const event = eventsData.find(e => e.id === eventId);
            if (event) {
                openRegistrationModal(event);
            }
        }
    });
    
    calendar.render();
}

// Get color for event type (used in calendar)
function getEventTypeColor(type) {
    const colors = {
        'cultural': '#e74c3c',
        'technical': '#3498db',
        'sports': '#2ecc71',
        'workshop': '#9b59b6',
        'seminar': '#f39c12',
        'educational': '#1abc9c'
    };
    
    return colors[type] || '#95a5a6';
}

// Filter Events
function filterEvents() {
    const typeValue = typeFilter.value;
    const dateValue = dateFilter.value;
    const departmentValue = departmentFilter.value;
    const searchValue = searchInput.value.toLowerCase().trim();
    
    let filteredEvents = eventsData.filter(event => {
        // Only show approved events
        if (event.status && event.status !== 'approved') {
            return false;
        }
        
        // Filter by type
        if (typeValue !== 'all' && event.type !== typeValue) {
            return false;
        }
        
        // Filter by department
        if (departmentValue !== 'all' && event.department !== departmentValue) {
            return false;
        }
        
        // Filter by date
        if (dateValue !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            
            if (dateValue === 'today' && eventDate.getTime() !== today.getTime()) {
                return false;
            } else if (dateValue === 'upcoming' && eventDate.getTime() < today.getTime()) {
                return false;
            } else if (dateValue === 'past' && eventDate.getTime() >= today.getTime()) {
                return false;
            }
        }
        
        // Filter by search term
        if (searchValue && !(
            event.title.toLowerCase().includes(searchValue) ||
            event.description.toLowerCase().includes(searchValue) ||
            event.location.toLowerCase().includes(searchValue)
        )) {
            return false;
        }
        
        return true;
    });
    
    currentEvents = filteredEvents;
    currentPage = 1;
    renderEvents(currentEvents, currentPage);
    
    // Update calendar if it's visible
    if (calendarView.style.display === 'block') {
        calendar.removeAllEvents();
        calendar.addEventSource(currentEvents.map(event => ({
            id: event.id.toString(),
            title: event.title,
            start: event.date,
            allDay: true,
            backgroundColor: getEventTypeColor(event.type),
            extendedProps: {
                location: event.location,
                description: event.description
            }
        })));
    }
}

// Clear Filters
function clearFilters() {
    typeFilter.value = 'all';
    dateFilter.value = 'all';
    departmentFilter.value = 'all';
    searchInput.value = '';
    
    currentEvents = [...eventsData];
    currentPage = 1;
    renderEvents(currentEvents, currentPage);
    
    // Update calendar if it's visible
    if (calendarView.style.display === 'block') {
        calendar.removeAllEvents();
        calendar.addEventSource(eventsData.map(event => ({
            id: event.id.toString(),
            title: event.title,
            start: event.date,
            allDay: true,
            backgroundColor: getEventTypeColor(event.type),
            extendedProps: {
                location: event.location,
                description: event.description
            }
        })));
    }
}

// Toggle View (Grid/List/Calendar)
function toggleView(viewType) {
    if (viewType === 'calendar') {
        eventsContainer.style.display = 'none';
        calendarView.style.display = 'block';
        loadMoreBtn.style.display = 'none';
        calendar.updateSize();
    } else {
        eventsContainer.style.display = 'grid';
        eventsContainer.className = viewType === 'grid' ? 'events-grid' : 'events-list';
        calendarView.style.display = 'none';
        
        if (currentEvents.length > currentPage * eventsPerPage) {
            loadMoreBtn.style.display = 'inline-block';
        }
        
        renderEvents(currentEvents, currentPage);
    }
}

// Open Registration Modal
function openRegistrationModal(event) {
    // Set modal content
    document.getElementById('eventTitleSpan').textContent = event.title;
    document.getElementById('eventDateSpan').textContent = formatDate(event.date);
    document.getElementById('eventTimeSpan').textContent = event.time;
    document.getElementById('eventLocationSpan').textContent = event.location;
    
    // Show modal
    registrationModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Set the current event ID for registration
    registrationForm.dataset.eventId = event.id;
}

// Close Modal
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle Registration Form Submission
function handleRegistration(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(registrationForm);
    const eventId = parseInt(registrationForm.dataset.eventId);
    const event = eventsData.find(e => e.id === eventId);
    
    // In a real app, this would be sent to the server
    console.log('Registration submitted for event:', eventId);
    console.log('Form data:', Object.fromEntries(formData));
    
    // Close registration modal
    registrationModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    registrationForm.reset();
    
    // Show success modal with E-Pass
    showRegistrationSuccess(event);
}

// Generate E-Pass
function generateEPass(registration, event) {
    // Format date for e-pass
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create e-pass preview
    ePassPreview.innerHTML = `
        <div class="e-pass">
            <div class="e-pass-header">
                <h3>Zeal Institute EventHub</h3>
                <p>E-Pass for Event</p>
            </div>
            <div class="e-pass-event">
                <h2>${event.title}</h2>
                <p><i class="fas fa-calendar-alt"></i> ${formattedDate} | ${event.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            </div>
            <div class="e-pass-attendee">
                <p><strong>Name:</strong> ${registration.fullName}</p>
                <p><strong>Student ID:</strong> ${registration.studentId}</p>
                <p><strong>Email:</strong> ${registration.email}</p>
                <p><strong>Phone:</strong> ${registration.phone}</p>
            </div>
            <div class="e-pass-barcode">
                <p class="code">${registration.epassCode}</p>
            </div>
            <div class="e-pass-footer">
                <p>Present this e-pass at the event entrance</p>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `;
}

// Download E-Pass as PDF
function downloadEPass() {
    const { jsPDF } = window.jspdf;
    
    html2canvas(ePassPreview, {
        scale: 2
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save('EventHub-EPass.pdf');
    });
    
    // Add notification for successful download
    const downloadNotification = {
        id: Date.now(),
        title: "E-Pass Downloaded",
        message: `Your e-pass for ${eventTitleSpan.textContent} has been downloaded successfully.`,
        time: "Just now",
        read: false
    };
    
    notificationsData.unshift(downloadNotification);
    updateNotifications();
}

// Load placeholder images for events without images
function loadPlaceholderImages() {
    // We would normally use actual event images, but for this demo we'll use placeholder images
    const placeholderBaseUrl = 'https://source.unsplash.com/300x200/?';
    
    eventsData.forEach(event => {
        if (!event.image || event.image.includes('images/')) {
            const keywords = event.type.replace('-', ',');
            event.image = `${placeholderBaseUrl}${keywords}`;
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    searchBtn.addEventListener('click', filterEvents);
    searchInput.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            filterEvents();
        }
    });
    
    // Filters
    typeFilter.addEventListener('change', filterEvents);
    dateFilter.addEventListener('change', filterEvents);
    departmentFilter.addEventListener('change', filterEvents);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // View Toggle
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            toggleView(button.getAttribute('data-view'));
        });
    });
    
    // Load More
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderEvents(currentEvents, currentPage);
    });
    
    // Mobile Navigation Toggle
    mobileToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
    });
    
    // Modal Close Buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', event => {
        if (event.target === registrationModal) {
            closeModal(registrationModal);
        }
        if (event.target === successModal) {
            closeModal(successModal);
        }
    });
    
    // Registration Form Submission
    registrationForm.addEventListener('submit', handleRegistration);
    
    // Download E-Pass
    downloadEPassBtn.addEventListener('click', downloadEPass);
    
    // Scroll Animation
    window.addEventListener('scroll', revealOnScroll);
}

// Reveal Elements on Scroll (Animation)
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 150) {
            section.classList.add('animate');
        }
    });
}

// Helper function: Format date
function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Helper function: Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Ensure all images are properly processed
    setTimeout(() => {
        processAllEventImages();
    }, 300);
});

// Process all event images to ensure proper display
function processAllEventImages() {
    const images = document.querySelectorAll('.event-image img');
    
    images.forEach(img => {
        // If image failed to load or hasn't loaded yet
        if (!img.complete || img.naturalHeight === 0) {
            const eventCard = img.closest('.event-card');
            if (!eventCard) return;
            
            let eventType = 'event';
            const typeElement = eventCard.querySelector('.event-type');
            if (typeElement) {
                eventType = typeElement.textContent.trim().toLowerCase();
            }
            
            // Generate a dynamic image for this element
            generateDynamicImage(img, eventType);
        }
    });
}

// Show Registration Success Modal
function showRegistrationSuccess(event) {
    // Create modal container if it doesn't exist
    let registrationSuccessModal = document.getElementById('registrationSuccessModal');
    
    if (!registrationSuccessModal) {
        registrationSuccessModal = document.createElement('div');
        registrationSuccessModal.id = 'registrationSuccessModal';
        registrationSuccessModal.className = 'modal registration-success-modal';
        document.body.appendChild(registrationSuccessModal);
    }
    
    // Generate a random e-pass code
    const epassCode = `ZEAL-${event.id}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Generate current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    
    // Format event date
    const eventDate = new Date(event.date);
    const formattedEventDate = `${eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })}`;
    
    // Create a mock user
    const mockUser = {
        name: "John Doe",
        id: "ST2023001",
        email: "john.doe@zeal.edu.in",
        phone: "+91 9876543210"
    };
    
    // Set modal content
    registrationSuccessModal.innerHTML = `
        <div class="modal-content registration-success-content">
            <span class="close-modal">&times;</span>
            
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            
            <h2>Registration Successful!</h2>
            
            <p class="success-message">
                Your e-pass is being generated. It will download automatically in a moment.
            </p>
            
            <div class="epass-container">
                <div class="epass-title-bar">
                    <h3>Zeal Institute EventHub</h3>
                    <p>E-Pass for Event</p>
                </div>
                
                <h3 class="epass-event-title">${event.title}</h3>
                
                <div class="epass-event-details">
                    <div class="epass-detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formattedEventDate}</span>
                    </div>
                    
                    <div class="epass-detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${event.time}</span>
                    </div>
                    
                    <div class="epass-detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                </div>
                
                <div class="epass-user-info">
                    <div class="epass-info-item">
                        <label>Name:</label>
                        <span>${mockUser.name}</span>
                    </div>
                    
                    <div class="epass-info-item">
                        <label>Student ID:</label>
                        <span>${mockUser.id}</span>
                    </div>
                    
                    <div class="epass-info-item">
                        <label>Email:</label>
                        <span>${mockUser.email}</span>
                    </div>
                    
                    <div class="epass-info-item">
                        <label>Phone:</label>
                        <span>${mockUser.phone}</span>
                    </div>
                </div>
                
                <div class="epass-code-box">
                    ${epassCode}
                </div>
                
                <div class="epass-footer">
                    <p>Present this e-pass at the event entrance</p>
                    <p>Generated on: ${formattedDate}</p>
                </div>
            </div>
            
            <div class="epass-actions">
                <button id="downloadEPassBtn" class="btn primary-btn download-btn">Download E-Pass</button>
            </div>
        </div>
    `;
    
    // Show the modal
    registrationSuccessModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners to the buttons
    const downloadBtn = document.getElementById('downloadEPassBtn');
    const closeBtn = registrationSuccessModal.querySelector('.close-modal');
    
    downloadBtn.addEventListener('click', () => {
        downloadEventEPass(event, epassCode, mockUser);
    });
    
    closeBtn.addEventListener('click', () => {
        registrationSuccessModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Auto-download the e-pass after 2 seconds (simulating "It will download automatically")
    setTimeout(() => {
        downloadEventEPass(event, epassCode, mockUser);
    }, 2000);
    
    // Add to user's registered events
    if (!userProfile.registeredEvents.includes(event.id)) {
        userProfile.registeredEvents.push(event.id);
        
        // Create mock registration
        const newRegistration = {
            id: Date.now(),
            eventId: event.id,
            userId: userProfile.id,
            registrationDate: new Date().toISOString(),
            epassCode: epassCode
        };
        
        // Add to mock registrations (if the mockRegistrations array exists)
        if (typeof mockRegistrations !== 'undefined') {
            mockRegistrations.push(newRegistration);
        }
    }
    
    // Add notification
    const newNotification = {
        id: Date.now(),
        title: "Registration Successful",
        message: `You've successfully registered for "${event.title}"`,
        time: "Just now",
        read: false
    };
    
    notificationsData.unshift(newNotification);
    updateNotifications();
}

// Download Event E-Pass
function downloadEventEPass(event, epassCode, user) {
    // Create a temporary container for the certificate to be downloaded
    const tempContainer = document.createElement('div');
    document.body.appendChild(tempContainer);
    
    // Format date for certificate
    const eventDate = new Date(event.date);
    const formattedEventDate = `${eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })}`;
    
    // Current date for "generated on"
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toLocaleString();
    
    // Set content for the certificate (styled for PDF)
    tempContainer.innerHTML = `
        <div class="certificate-for-download" style="
            width: 800px;
            padding: 30px;
            background-color: white;
            font-family: 'Poppins', sans-serif;
            color: #333;
            border: 1px solid #eee;
        ">
            <div style="
                text-align: center;
                padding: 20px;
                background-color: #f39c12;
                color: white;
                margin-bottom: 30px;
            ">
                <h1 style="margin: 0; font-size: 28px;">Zeal Institute EventHub</h1>
                <p style="margin: 5px 0 0; font-size: 18px;">E-Pass for Event</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="${event.image}" alt="${event.title}" style="
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 5px solid #f0f0f0;
                    margin-bottom: 15px;
                ">
                <h2 style="margin: 15px 0; font-size: 26px; color: #333;">${event.title}</h2>
            </div>
            
            <div style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 25px;
                border-bottom: 1px dashed #ddd;
                padding-bottom: 20px;
            ">
                <div style="flex: 1; padding-right: 20px;">
                    <p style="margin: 10px 0; font-size: 16px;">
                        <span style="color: #3498db; margin-right: 10px;">
                            <i class="fas fa-calendar-alt"></i>
                        </span>
                        ${formattedEventDate}
                    </p>
                    <p style="margin: 10px 0; font-size: 16px;">
                        <span style="color: #3498db; margin-right: 10px;">
                            <i class="fas fa-clock"></i>
                        </span>
                        ${event.time}
                    </p>
                    <p style="margin: 10px 0; font-size: 16px;">
                        <span style="color: #3498db; margin-right: 10px;">
                            <i class="fas fa-map-marker-alt"></i>
                        </span>
                        ${event.location}
                    </p>
                </div>
                <div style="flex: 1; padding-left: 20px; border-left: 1px solid #eee;">
                    <p style="margin: 10px 0; font-size: 16px;">
                        <strong style="display: inline-block; width: 100px; color: #555;">Name:</strong> 
                        ${user.name}
                    </p>
                    <p style="margin: 10px 0; font-size: 16px;">
                        <strong style="display: inline-block; width: 100px; color: #555;">Student ID:</strong> 
                        ${user.id}
                    </p>
                    <p style="margin: 10px 0; font-size: 16px;">
                        <strong style="display: inline-block; width: 100px; color: #555;">Email:</strong> 
                        ${user.email}
                    </p>
                    <p style="margin: 10px 0; font-size: 16px;">
                        <strong style="display: inline-block; width: 100px; color: #555;">Phone:</strong> 
                        ${user.phone}
                    </p>
                </div>
            </div>
            
            <div style="
                text-align: center;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 8px;
                margin-bottom: 30px;
            ">
                <p style="
                    font-family: monospace;
                    font-size: 22px;
                    font-weight: 600;
                    letter-spacing: 2px;
                    margin: 0;
                ">${epassCode}</p>
            </div>
            
            <div style="text-align: center; color: #777; font-size: 14px;">
                <p style="margin: 5px 0;">Present this e-pass at the event entrance</p>
                <p style="margin: 5px 0;">Generated on: ${formattedCurrentDate}</p>
            </div>
        </div>
    `;
    
    // Use html2canvas to create an image of the certificate
    html2canvas(tempContainer.querySelector('.certificate-for-download'), {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        // Remove the temporary container
        document.body.removeChild(tempContainer);
        
        // Convert canvas to image data
        const imgData = canvas.toDataURL('image/png');
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Calculate dimensions to fit the certificate on the PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        
        // Save the PDF
        pdf.save(`${event.title}-EPass.pdf`);
    }).catch(err => {
        console.error("Error generating PDF:", err);
        alert("There was an error generating the PDF. Please try again.");
    });
} 