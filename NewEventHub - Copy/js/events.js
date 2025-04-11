// DOM Elements
const eventsContainer = document.getElementById('eventsContainer');
const calendarView = document.getElementById('calendarView');
const viewButtons = document.querySelectorAll('.view-btn');
const typeFilter = document.getElementById('typeFilter');
const dateFilter = document.getElementById('dateFilter');
const departmentFilter = document.getElementById('departmentFilter');
const sortFilter = document.getElementById('sortFilter');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearFiltersBtn = document.getElementById('clearFilters');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const eventCountDisplay = document.getElementById('eventCount');
const registrationModal = document.getElementById('registrationModal');
const successModal = document.getElementById('successModal');
const registrationForm = document.getElementById('registrationForm');
const modalEventTitle = document.getElementById('eventTitle');
const modalEventId = document.getElementById('eventId');
const ePassPreview = document.getElementById('ePassPreview');
const downloadEPassBtn = document.getElementById('downloadEPass');
const shareEventBtn = document.getElementById('shareEvent');
const notificationCount = document.querySelector('.notification-count');
const notificationList = document.getElementById('notificationList');
const closeModalBtns = document.querySelectorAll('.close-modal');
const mobileToggle = document.querySelector('.mobile-toggle');
const mainNav = document.querySelector('.main-nav');

// Variables
let calendar;
let currentView = 'grid';
let currentPage = 1;
let eventsPerPage = 6;
let filteredEvents = [];

// Initialize page
function init() {
    createEventLogos(); // Create text-based event logos
    // Only include approved events in the filtered events
    filteredEvents = eventsData.filter(event => !event.status || event.status === 'approved');
    renderEvents(filteredEvents, 1);
    initializeCalendar();
    setupEventListeners();
    updateNotifications();
    updateEventCount();
}

// Render Events
function renderEvents(events, page) {
    const start = (page - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    const currentEvents = events.slice(start, end);
    
    if (page === 1) {
        eventsContainer.innerHTML = '';
    }
    
    if (events.length === 0) {
        eventsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No Events Found</h3>
                <p>Try adjusting your filters or search criteria.</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    currentEvents.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
        
        // Trigger layout and add animation
        setTimeout(() => {
            eventCard.style.opacity = '1';
            eventCard.style.transform = 'translateY(0)';
        }, 50);
    });
    
    loadMoreBtn.style.display = end < events.length ? 'block' : 'none';
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

// Initialize Calendar
function initializeCalendar() {
    const calendarEl = document.getElementById('calendarView');
    
    // Filter events to only include approved events
    const approvedEvents = eventsData.filter(event => !event.status || event.status === 'approved');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: approvedEvents.map(event => ({
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
    const sortValue = sortFilter.value;
    const searchValue = searchInput.value.toLowerCase().trim();
    
    filteredEvents = eventsData.filter(event => {
        // Only show approved events
        if (event.status && event.status !== 'approved') {
            return false;
        }
        
        // Type filter
        if (typeValue !== 'all' && event.type !== typeValue) {
            return false;
        }
        
        // Department filter
        if (departmentValue !== 'all' && event.department !== departmentValue) {
            return false;
        }
        
        // Date filter
        if (dateValue !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            
            const nextMonth = new Date(today);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            
            const eventDate = new Date(event.date);
            
            if (dateValue === 'today' && eventDate.toDateString() !== today.toDateString()) {
                return false;
            } else if (dateValue === 'tomorrow' && eventDate.toDateString() !== tomorrow.toDateString()) {
                return false;
            } else if (dateValue === 'this-week' && (eventDate < today || eventDate >= nextWeek)) {
                return false;
            } else if (dateValue === 'this-month' && (eventDate < today || eventDate >= nextMonth)) {
                return false;
            }
        }
        
        // Search filter
        if (searchValue && !event.title.toLowerCase().includes(searchValue) && 
            !event.description.toLowerCase().includes(searchValue) && 
            !event.location.toLowerCase().includes(searchValue)) {
            return false;
        }
        
        return true;
    });
    
    // Sort events
    if (sortValue === 'date-asc') {
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortValue === 'date-desc') {
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortValue === 'name-asc') {
        filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'name-desc') {
        filteredEvents.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    // Reset to page 1 and render
    currentPage = 1;
    renderEvents(filteredEvents, 1);
    updateEventCount();
}

// Update Event Count Display
function updateEventCount() {
    eventCountDisplay.textContent = `(${filteredEvents.length})`;
}

// Clear Filters
function clearFilters() {
    typeFilter.value = 'all';
    dateFilter.value = 'all';
    departmentFilter.value = 'all';
    sortFilter.value = 'date-asc';
    searchInput.value = '';
    
    filteredEvents = [...eventsData];
    currentPage = 1;
    renderEvents(filteredEvents, 1);
    updateEventCount();
}

// Toggle View
function toggleView(viewType) {
    currentView = viewType;
    
    // Update button active state
    viewButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewType) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide appropriate view
    if (viewType === 'calendar') {
        eventsContainer.style.display = 'none';
        calendarView.style.display = 'block';
        loadMoreBtn.style.display = 'none';
        calendar.render(); // Re-render calendar to fix sizing issues
    } else {
        eventsContainer.style.display = viewType === 'grid' ? 'grid' : 'block';
        calendarView.style.display = 'none';
        eventsContainer.className = viewType === 'grid' ? 'events-grid' : 'events-list';
        loadMoreBtn.style.display = currentPage * eventsPerPage < filteredEvents.length ? 'block' : 'none';
        
        // Re-render events for the current view
        renderEvents(filteredEvents, 1);
    }
}

// Open Registration Modal
function openRegistrationModal(event) {
    modalEventTitle.textContent = event.title;
    modalEventId.value = event.id;
    
    registrationModal.style.display = 'flex';
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
        alert('Event not found');
        return;
    }
    
    const registration = {
        id: Date.now(),
        eventId: eventId,
        fullName: formData.get('fullName'),
        studentId: formData.get('studentId'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        timestamp: new Date().toISOString()
    };
    
    // In a real app, this would be an API call
    userRegistrations.push(registration);
    
    // Add to user profile's registered events
    if (!userProfile.registeredEvents.includes(eventId)) {
        userProfile.registeredEvents.push(eventId);
    }
    
    // Close registration modal
    closeModal(registrationModal);
    
    // Generate E-Pass
    generateEPass(registration, event);
    
    // Show success modal
    successModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add notification
    const newNotification = {
        id: Date.now(),
        title: "Registration Successful",
        message: `You have successfully registered for "${event.title}"`,
        time: "Just now",
        read: false
    };
    
    notificationsData.unshift(newNotification);
    updateNotifications();
    
    // Reset form
    registrationForm.reset();
}

// Generate E-Pass
function generateEPass(registration, event) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    ePassPreview.innerHTML = `
        <div class="e-pass" id="ePass">
            <div class="e-pass-header">
                <h3>ZEAL INSTITUTE EVENT E-PASS</h3>
                <p>ID: EP-${registration.id}</p>
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
            </div>
            <div class="e-pass-barcode">
                <div class="code">EP-${registration.id}-${registration.studentId}</div>
            </div>
            <div class="e-pass-footer">
                <p>This e-pass must be presented at the event entrance.</p>
                <p>© ${new Date().getFullYear()} EventHub - Zeal Institute</p>
            </div>
        </div>
    `;
}

// Download E-Pass
function downloadEPass() {
    const ePass = document.getElementById('ePass');
    
    if (!ePass) {
        alert('E-Pass not found');
        return;
    }
    
    html2canvas(ePass).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const width = pdf.internal.pageSize.getWidth();
        const height = canvas.height * width / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`EventHub_EPass_${Date.now()}.pdf`);
    });
}

// Share Event
function shareEvent() {
    const eventId = document.getElementById('eventId').value;
    const event = eventsData.find(e => e.id === parseInt(eventId));
    
    if (!event) {
        alert('Event not found');
        return;
    }
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: event.title,
            text: `Check out this event: ${event.title} at ${event.location}`,
            url: window.location.href
        })
        .catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `Check out this event: ${event.title} at ${event.location}`;
        prompt('Copy this link to share:', shareText + '\n' + window.location.href);
    }
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

// Setup Event Listeners
function setupEventListeners() {
    // View toggle buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => toggleView(btn.dataset.view));
    });
    
    // Filter change
    typeFilter.addEventListener('change', filterEvents);
    dateFilter.addEventListener('change', filterEvents);
    departmentFilter.addEventListener('change', filterEvents);
    sortFilter.addEventListener('change', filterEvents);
    
    // Search button
    searchBtn.addEventListener('click', filterEvents);
    
    // Search input (search as you type)
    searchInput.addEventListener('input', filterEvents);
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Load more button
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderEvents(filteredEvents, currentPage);
    });
    
    // Form submission
    registrationForm.addEventListener('submit', handleRegistration);
    
    // Download E-Pass
    downloadEPassBtn.addEventListener('click', downloadEPass);
    
    // Share Event
    shareEventBtn.addEventListener('click', shareEvent);
    
    // Close modal buttons
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
    
    // Mobile Navigation Toggle
    mobileToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
    });
}

// Helper Functions
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 