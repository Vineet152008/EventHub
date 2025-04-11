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
const shareEventBtn = document.getElementById('shareEvent');
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

    // Generate random number of participants for demo purposes
    const participantCount = Math.floor(Math.random() * 30) + 5;
    
    // Create avatar HTML
    const avatarHTML = generateParticipantAvatars(participantCount);
    
    eventCard.innerHTML = `
        <div class="event-image">
            <img src="${event.image}" alt="${event.title}" loading="lazy">
            <span class="event-type">${eventTypeName}</span>
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

// Render Featured Events
function renderFeaturedEvents() {
    featuredTrack.innerHTML = '';
    
    featuredEvents.forEach(event => {
        const featuredEvent = document.createElement('div');
        featuredEvent.className = 'featured-event';
        
        // Get event type name from type ID
        const eventType = eventTypes.find(type => type.id === event.type);
        const eventTypeName = eventType ? eventType.name : 'Event';
        
        // Generate random number of participants for demo purposes
        const participantCount = Math.floor(Math.random() * 30) + 5;
        
        // Create avatar HTML
        const avatarHTML = generateParticipantAvatars(participantCount);
        
        featuredEvent.innerHTML = `
            <div class="event-card">
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}" loading="lazy">
                    <span class="event-type">${eventTypeName}</span>
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

// Update Notifications
function updateNotifications() {
    const unreadCount = notificationsData.filter(notification => !notification.read).length;
    notificationCount.textContent = unreadCount;
    
    if (notificationsData.length === 0) {
        notificationList.innerHTML = '<p class="empty-notification">No new notifications</p>';
        return;
    }
    
    notificationList.innerHTML = '';
    notificationsData.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        
        notificationItem.innerHTML = `
            <h4>${notification.title}</h4>
            <p>${notification.message}</p>
            <span class="notification-time">${notification.time}</span>
        `;
        
        notificationItem.addEventListener('click', () => {
            notification.read = true;
            updateNotifications();
        });
        
        notificationList.appendChild(notificationItem);
    });
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
    eventTitleSpan.textContent = event.title;
    eventIdInput.value = event.id;
    
    registrationModal.style.display = 'flex';
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle Registration Form Submission
function handleRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(registrationForm);
    const eventId = parseInt(formData.get('eventId'));
    const event = eventsData.find(e => e.id === eventId);
    
    if (!event) {
        return;
    }
    
    // Create a registration entry
    const registration = {
        id: Date.now(),
        eventId: eventId,
        fullName: formData.get('fullName'),
        studentId: formData.get('studentId'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        registrationDate: new Date().toISOString(),
        epassCode: `ZEAL-${eventId}-${Date.now().toString().substr(5)}`
    };
    
    // Add to registrations (simulating database save)
    userRegistrations.push(registration);
    
    // Close registration modal
    closeModal(registrationModal);
    
    // Generate e-pass preview
    generateEPass(registration, event);
    
    // Show success modal
    successModal.style.display = 'flex';
    
    // Reset form
    registrationForm.reset();
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

// Share Event
function shareEvent() {
    const eventTitle = eventTitleSpan.textContent;
    const shareText = `Join me at ${eventTitle} - EventHub, Zeal Institute!`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'EventHub - Zeal Institute',
            text: shareText,
            url: window.location.href
        }).catch(err => {
            console.error('Error sharing:', err);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        prompt('Copy this link to share:', `${window.location.href}?event=${eventTitleSpan.textContent}`);
    }
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

// Create text-based logos for events
function createEventLogos() {
    // Create dynamic logos for each event with text representation
    eventsData.forEach(event => {
        // Get background color based on event type
        const colors = {
            'technical': '#3498db',
            'cultural': '#e74c3c',
            'workshop': '#9b59b6',
            'sports': '#2ecc71',
            'seminar': '#f39c12',
            'educational': '#1abc9c'
        };
        
        const bgColor = colors[event.type] || '#95a5a6';
        const textColor = '#ffffff';
        const shortTitle = event.title.split(':')[0].trim(); // Use first part of title if it has a colon
        
        // Create logo data URL
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = 300;
        canvas.height = 200;
        
        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add texture/pattern to make it look nicer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 50 + 20;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw event title
        ctx.fillStyle = textColor;
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Handle multiline text if title is long
        const words = shortTitle.split(' ');
        let line = '';
        const lines = [];
        const maxWidth = canvas.width - 40;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                lines.push(line);
                line = words[i] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        
        // Draw each line of text
        const lineHeight = 30;
        let y = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;
        
        lines.forEach(line => {
            ctx.fillText(line, canvas.width / 2, y);
            y += lineHeight;
        });
        
        // Add an icon based on event type
        const icons = {
            'technical': '🖥️',
            'cultural': '🎭',
            'workshop': '🔧',
            'sports': '🏆',
            'seminar': '📢',
            'educational': '📚'
        };
        
        // Draw icon
        ctx.font = '40px Arial, sans-serif';
        ctx.fillText(icons[event.type] || '📅', canvas.width / 2, 40);
        
        // Set the image data URL to the event
        event.image = canvas.toDataURL('image/png');
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
    
    // Share Event
    shareEventBtn.addEventListener('click', shareEvent);
    
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
document.addEventListener('DOMContentLoaded', init); 