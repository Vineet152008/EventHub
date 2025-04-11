// DOM Elements
const profileNavItems = document.querySelectorAll('.profile-nav li');
const profileTabs = document.querySelectorAll('.profile-tab');
const registeredEventsList = document.getElementById('registeredEventsList');
const myEventsList = document.getElementById('myEventsList');
const ePassesGrid = document.getElementById('ePassesGrid');
const registeredEventsFilter = document.getElementById('registeredEventsFilter');
const myEventsFilter = document.getElementById('myEventsFilter');
const accountSettingsForm = document.getElementById('accountSettingsForm');
const userNameElement = document.getElementById('userName');
const userDepartmentElement = document.getElementById('userDepartment');
const userEmailElement = document.getElementById('userEmail');
const changeAvatarBtn = document.querySelector('.change-avatar-btn');
const avatarUpload = document.getElementById('avatarUpload');
const userAvatarImg = document.getElementById('userAvatar');
const ePassModal = document.getElementById('ePassModal');
const modalEPassPreview = document.getElementById('modalEPassPreview');
const downloadEPassBtn = document.getElementById('downloadEPass');
const shareEPassBtn = document.getElementById('shareEPass');
const successModal = document.getElementById('successModal');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const closeModalBtns = document.querySelectorAll('.close-modal');
const notificationCount = document.querySelector('.notification-count');
const notificationList = document.getElementById('notificationList');
const mobileToggle = document.querySelector('.mobile-toggle');
const mainNav = document.querySelector('.main-nav');

// Mock Registrations data (In a real app, this would come from a database)
const mockRegistrations = [
    {
        id: 101,
        eventId: 1,
        userId: userProfile.id,
        registrationDate: '2023-11-20T10:30:00',
        epassCode: 'ZEAL-1-56789'
    },
    {
        id: 102,
        eventId: 3,
        userId: userProfile.id,
        registrationDate: '2023-11-22T14:15:00',
        epassCode: 'ZEAL-3-67890'
    },
    {
        id: 103,
        eventId: 6,
        userId: userProfile.id,
        registrationDate: '2023-11-23T09:45:00',
        epassCode: 'ZEAL-6-78901'
    }
];

// Mock User Created Events
const mockUserEvents = [
    {
        id: 13,
        title: "Web Development Workshop",
        type: "workshop",
        department: "computer",
        date: "2023-12-28",
        time: "2:00 PM - 5:00 PM",
        location: "Lab 4, Computer Building, Zeal Campus",
        description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript. Hands-on session with project work.",
        image: "https://source.unsplash.com/300x200/?coding",
        featured: false,
        registrationFee: "₹50",
        capacity: 30,
        organizer: "Web Development Club",
        status: "approved"
    },
    {
        id: 14,
        title: "Debate Competition: Tech Ethics",
        type: "cultural",
        department: "all",
        date: "2024-01-10",
        time: "3:00 PM - 6:00 PM",
        location: "Seminar Hall, Zeal Campus",
        description: "A debate on ethical considerations in technology and AI. Teams will argue for and against various ethical dilemmas in tech.",
        image: "https://source.unsplash.com/300x200/?debate",
        featured: false,
        registrationFee: "Free",
        capacity: 50,
        organizer: "Debate Club",
        status: "pending"
    }
];

// Initialize page
function init() {
    setupEventListeners();
    loadUserProfile();
    loadRegisteredEvents();
    loadUserCreatedEvents();
    loadEPasses();
    updateNotifications();
}

// Tab switching functionality
function switchTab(tabId) {
    // Hide all tabs
    profileTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav items
    profileNavItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show the selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Add active class to the clicked nav item
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Load user profile data
function loadUserProfile() {
    // Get department name
    const department = departments.find(dept => dept.id === userProfile.department);
    const departmentName = department ? department.name : 'Department';
    
    // Update profile elements
    userNameElement.textContent = userProfile.name;
    userDepartmentElement.textContent = departmentName;
    userEmailElement.textContent = userProfile.email;
    
    // Set form values
    document.getElementById('fullName').value = userProfile.name;
    document.getElementById('studentId').value = userProfile.id;
    document.getElementById('email').value = userProfile.email;
    document.getElementById('phone').value = userProfile.phone;
    document.getElementById('userDept').value = userProfile.department;
}

// Load registered events
function loadRegisteredEvents() {
    const filterValue = registeredEventsFilter.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get registered events
    const registeredEventIds = userProfile.registeredEvents;
    let registeredEvents = eventsData.filter(event => registeredEventIds.includes(event.id));
    
    // Apply filter
    if (filterValue === 'upcoming') {
        registeredEvents = registeredEvents.filter(event => new Date(event.date) >= today);
    } else if (filterValue === 'past') {
        registeredEvents = registeredEvents.filter(event => new Date(event.date) < today);
    }
    
    // Sort by date (newest first)
    registeredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render events
    registeredEventsList.innerHTML = '';
    
    if (registeredEvents.length === 0) {
        registeredEventsList.innerHTML = '<p class="empty-list">No registered events found</p>';
        return;
    }
    
    registeredEvents.forEach(event => {
        const registration = mockRegistrations.find(reg => reg.eventId === event.id);
        const eventItem = createEventItem(event, registration, 'registered');
        registeredEventsList.appendChild(eventItem);
    });
}

// Load user created events
function loadUserCreatedEvents() {
    const filterValue = myEventsFilter.value;
    
    // In a real app, we would fetch events created by the current user
    // For this demo, we'll use the mock data
    let userEvents = [...mockUserEvents];
    
    // Apply filter
    if (filterValue === 'approved') {
        userEvents = userEvents.filter(event => event.status === 'approved');
    } else if (filterValue === 'pending') {
        userEvents = userEvents.filter(event => event.status === 'pending');
    }
    
    // Sort by date (newest first)
    userEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render events
    myEventsList.innerHTML = '';
    
    if (userEvents.length === 0) {
        myEventsList.innerHTML = '<p class="empty-list">No events found</p>';
        return;
    }
    
    userEvents.forEach(event => {
        const eventItem = createEventItem(event, null, 'created');
        myEventsList.appendChild(eventItem);
    });
}

// Load E-Passes
function loadEPasses() {
    // Get registered events
    const registeredEventIds = userProfile.registeredEvents;
    const registeredEvents = eventsData.filter(event => registeredEventIds.includes(event.id));
    
    ePassesGrid.innerHTML = '';
    
    if (registeredEvents.length === 0) {
        ePassesGrid.innerHTML = '<p class="empty-list">No e-passes found</p>';
        return;
    }
    
    registeredEvents.forEach(event => {
        const registration = mockRegistrations.find(reg => reg.eventId === event.id);
        if (registration) {
            const ePassCard = createEPassCard(event, registration);
            ePassesGrid.appendChild(ePassCard);
        }
    });
}

// Create event item for lists
function createEventItem(event, registration, type) {
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    
    // Format date
    const eventDate = new Date(event.date);
    const formattedDate = formatDate(event.date);
    
    // Check if event is past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = eventDate < today;
    
    // Create HTML
    eventItem.innerHTML = `
        <div class="event-item-image">
            <img src="${event.image}" alt="${event.title}">
        </div>
        <div class="event-item-details">
            ${type === 'created' ? `<span class="event-status ${event.status}">${event.status}</span>` : ''}
            <h3 class="event-item-title">${event.title}</h3>
            <p class="event-item-date"><i class="fas fa-calendar-alt"></i> ${formattedDate} | ${event.time}</p>
            <p class="event-item-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <div class="event-item-actions">
                ${type === 'registered' && !isPast ? 
                    `<button class="btn primary-btn view-epass-btn" data-event-id="${event.id}">View E-Pass</button>
                     <button class="btn secondary-btn cancel-btn" data-event-id="${event.id}">Cancel Registration</button>` : 
                    type === 'registered' && isPast ? 
                    `<button class="btn primary-btn view-epass-btn" data-event-id="${event.id}">View E-Pass</button>` : 
                    type === 'created' ? 
                    `<button class="btn secondary-btn edit-btn" data-event-id="${event.id}">Edit Event</button>
                     <button class="btn primary-btn details-btn" data-event-id="${event.id}">View Details</button>` : ''
                }
            </div>
        </div>
    `;
    
    // Add event listeners
    if (type === 'registered') {
        const viewEPassBtn = eventItem.querySelector('.view-epass-btn');
        viewEPassBtn.addEventListener('click', () => {
            openEPassModal(event, registration);
        });
        
        if (!isPast) {
            const cancelBtn = eventItem.querySelector('.cancel-btn');
            cancelBtn.addEventListener('click', () => {
                cancelRegistration(event.id);
            });
        }
    } else if (type === 'created') {
        const editBtn = eventItem.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            editEvent(event.id);
        });
        
        const detailsBtn = eventItem.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => {
            viewEventDetails(event.id);
        });
    }
    
    return eventItem;
}

// Create E-Pass card
function createEPassCard(event, registration) {
    const ePassCard = document.createElement('div');
    ePassCard.className = 'e-pass-card';
    ePassCard.dataset.eventId = event.id;
    
    // Format date
    const formattedDate = formatDate(event.date);
    
    ePassCard.innerHTML = `
        <div class="e-pass-header">
            <h3>Event E-Pass</h3>
        </div>
        <div class="e-pass-body">
            <h3 class="e-pass-event-title">${event.title}</h3>
            <div class="e-pass-details">
                <p><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-user"></i> ${userProfile.name}</p>
            </div>
            <div class="e-pass-code">${registration.epassCode}</div>
        </div>
    `;
    
    // Add click event to open modal
    ePassCard.addEventListener('click', () => {
        openEPassModal(event, registration);
    });
    
    return ePassCard;
}

// Open E-Pass Modal
function openEPassModal(event, registration) {
    // Format date for e-pass
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create e-pass preview
    modalEPassPreview.innerHTML = `
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
                <p><strong>Name:</strong> ${userProfile.name}</p>
                <p><strong>Student ID:</strong> ${userProfile.id}</p>
                <p><strong>Email:</strong> ${userProfile.email}</p>
                <p><strong>Phone:</strong> ${userProfile.phone}</p>
            </div>
            <div class="e-pass-barcode">
                <p class="code">${registration.epassCode}</p>
            </div>
            <div class="e-pass-footer">
                <p>Present this e-pass at the event entrance</p>
                <p>Generated on: ${new Date(registration.registrationDate).toLocaleString()}</p>
            </div>
        </div>
    `;
    
    // Show modal
    ePassModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Set current e-pass for download and share
    downloadEPassBtn.dataset.eventId = event.id;
    shareEPassBtn.dataset.eventId = event.id;
}

// Download E-Pass as PDF
function downloadEPass(eventId) {
    const { jsPDF } = window.jspdf;
    
    html2canvas(modalEPassPreview, {
        scale: 2
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`EventHub-EPass-${eventId}.pdf`);
    });
}

// Share E-Pass
function shareEPass(eventId) {
    const event = eventsData.find(e => e.id === parseInt(eventId));
    const shareText = `My e-pass for ${event.title} at Zeal Institute EventHub`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'EventHub E-Pass',
            text: shareText,
            url: window.location.href
        }).catch(err => {
            console.error('Error sharing:', err);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        prompt('Copy this link to share your e-pass:', `${window.location.href}?epass=${eventId}`);
    }
}

// Cancel registration
function cancelRegistration(eventId) {
    if (confirm('Are you sure you want to cancel your registration for this event?')) {
        // In a real app, this would send a request to the server
        // For this demo, we'll just remove it from the local data
        const index = userProfile.registeredEvents.indexOf(eventId);
        if (index > -1) {
            userProfile.registeredEvents.splice(index, 1);
        }
        
        // Reload registered events
        loadRegisteredEvents();
        loadEPasses();
        
        // Add notification
        const event = eventsData.find(e => e.id === eventId);
        const newNotification = {
            id: Date.now(),
            title: "Registration Cancelled",
            message: `Your registration for "${event.title}" has been cancelled.`,
            time: "Just now",
            read: false
        };
        
        notificationsData.unshift(newNotification);
        updateNotifications();
    }
}

// Edit event (redirect to add event page with prefilled data)
function editEvent(eventId) {
    // In a real app, this would redirect to the add event page with the event data
    // For this demo, we'll just log it
    console.log(`Edit event ${eventId}`);
    alert(`In a real app, this would redirect to the add event page with event ${eventId} data prefilled.`);
}

// View event details
function viewEventDetails(eventId) {
    // In a real app, this would redirect to the event details page
    // For this demo, we'll just log it
    console.log(`View event details ${eventId}`);
    alert(`In a real app, this would redirect to the event details page for event ${eventId}.`);
}

// Handle avatar change
function handleAvatarChange(e) {
    const file = e.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            userAvatarImg.src = event.target.result;
        };
        
        reader.readAsDataURL(file);
    }
}

// Handle account settings form submission
function handleSettingsSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(accountSettingsForm);
    
    // Update user profile (in a real app, this would be sent to the server)
    userProfile.name = formData.get('fullName');
    userProfile.email = formData.get('email');
    userProfile.phone = formData.get('phone');
    userProfile.department = formData.get('userDept');
    
    // Update displayed profile info
    loadUserProfile();
    
    // Show success modal
    successModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add notification
    const newNotification = {
        id: Date.now(),
        title: "Profile Updated",
        message: "Your profile information has been updated successfully.",
        time: "Just now",
        read: false
    };
    
    notificationsData.unshift(newNotification);
    updateNotifications();
}

// Update notifications
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

// Close modal
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Format date
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Setup Event Listeners
function setupEventListeners() {
    // Tab switching
    profileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Event filters
    registeredEventsFilter.addEventListener('change', loadRegisteredEvents);
    myEventsFilter.addEventListener('change', loadUserCreatedEvents);
    
    // Account settings form
    accountSettingsForm.addEventListener('submit', handleSettingsSubmit);
    
    // Avatar change
    changeAvatarBtn.addEventListener('click', () => {
        avatarUpload.click();
    });
    
    avatarUpload.addEventListener('change', handleAvatarChange);
    
    // E-Pass download and share
    downloadEPassBtn.addEventListener('click', () => {
        const eventId = downloadEPassBtn.dataset.eventId;
        downloadEPass(eventId);
    });
    
    shareEPassBtn.addEventListener('click', () => {
        const eventId = shareEPassBtn.dataset.eventId;
        shareEPass(eventId);
    });
    
    // Close success modal
    closeSuccessBtn.addEventListener('click', () => {
        closeModal(successModal);
    });
    
    // Modal close buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', event => {
        if (event.target === ePassModal) {
            closeModal(ePassModal);
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 