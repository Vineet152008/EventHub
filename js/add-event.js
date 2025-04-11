// DOM Elements
const addEventForm = document.getElementById('addEventForm');
const previewEventBtn = document.getElementById('previewEventBtn');
const previewModal = document.getElementById('previewModal');
const successModal = document.getElementById('successModal');
const previewEventCard = document.getElementById('previewEventCard');
const editEventBtn = document.getElementById('editEventBtn');
const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
const viewEventsBtn = document.getElementById('viewEventsBtn');
const addAnotherEventBtn = document.getElementById('addAnotherEventBtn');
const eventImageInput = document.getElementById('eventImage');
const imagePreview = document.getElementById('imagePreview');
const notificationCount = document.querySelector('.notification-count');
const notificationList = document.getElementById('notificationList');
const closeModalBtns = document.querySelectorAll('.close-modal');
const mobileToggle = document.querySelector('.mobile-toggle');
const mainNav = document.querySelector('.main-nav');

// Variables
let eventImageURL = null;
let eventId = eventsData.length + 1;

// Initialize page
function init() {
    setupEventListeners();
    updateNotifications();
    setMinDate();
}

// Set minimum date for event date input (today)
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').min = today;
}

// Preview event based on form data
function previewEvent() {
    // Validate form before showing preview
    if (!validateForm()) {
        return;
    }

    // Get form data
    const formData = new FormData(addEventForm);
    const eventTitle = formData.get('eventTitle');
    const eventType = formData.get('eventType');
    const eventDate = formData.get('eventDate');
    const eventTime = formData.get('eventTime');
    const eventLocation = formData.get('eventLocation');
    const eventDepartment = formData.get('eventDepartment');
    const eventDescription = formData.get('eventDescription');
    const eventOrganizer = formData.get('eventOrganizer');
    const registrationFee = formData.get('registrationFee') || 'Free';
    const eventCapacity = formData.get('eventCapacity') || 'Unlimited';

    // Get department name
    const department = departments.find(dept => dept.id === eventDepartment);
    const departmentName = department ? department.name : 'All Departments';

    // Get event type name
    const eventTypeObj = eventTypes.find(type => type.id === eventType);
    const eventTypeName = eventTypeObj ? eventTypeObj.name : 'Event';

    // Format event date for display
    const formattedDate = formatDate(eventDate);
    
    // Get event type color
    let typeColor = '#3498db'; // default blue
    switch(eventType) {
        case 'cultural': typeColor = '#e74c3c'; break;
        case 'technical': typeColor = '#3498db'; break;
        case 'sports': typeColor = '#2ecc71'; break;
        case 'workshop': typeColor = '#9b59b6'; break;
        case 'seminar': typeColor = '#f39c12'; break;
        case 'educational': typeColor = '#1abc9c'; break;
    }

    // Create preview card with enhanced styling
    previewEventCard.innerHTML = `
        <div class="event-image">
            <img src="${eventImageURL || 'https://source.unsplash.com/300x200/?' + eventType}" alt="${eventTitle}" loading="lazy">
            <span class="event-type" style="background-color:${typeColor}">${eventTypeName}</span>
        </div>
        <div class="event-details">
            <div class="event-date">
                <i class="fas fa-calendar-alt"></i> ${formattedDate} | ${eventTime}
            </div>
            <h3 class="event-title">${eventTitle}</h3>
            <div class="event-location">
                <i class="fas fa-map-marker-alt"></i> ${eventLocation}
            </div>
            <p class="event-description">${eventDescription}</p>
            <div class="event-info" style="background-color:#f9f9f9;padding:15px;border-radius:8px;margin-bottom:15px;">
                <p><strong>Organizer:</strong> ${eventOrganizer}</p>
                <p><strong>Registration Fee:</strong> ${registrationFee}</p>
                <p><strong>Capacity:</strong> ${eventCapacity}</p>
                <p><strong>Department:</strong> ${departmentName}</p>
            </div>
            <div class="event-footer">
                <span class="department">${departmentName}</span>
                <button class="btn primary-btn register-btn">Register</button>
            </div>
        </div>
    `;

    // Make sure the preview card is visible by setting explicit styles
    previewEventCard.style.opacity = '1';
    previewEventCard.style.transform = 'none';
    previewEventCard.style.display = 'block';
    
    // Show preview modal
    previewModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Validate form data
function validateForm() {
    // Required fields check
    const requiredFields = [
        'eventTitle', 
        'eventType', 
        'eventDate', 
        'eventTime', 
        'eventLocation', 
        'eventDepartment', 
        'eventOrganizer', 
        'eventDescription'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // Terms agreement check
    const termsAgreement = document.getElementById('termsAgreement');
    if (!termsAgreement.checked) {
        termsAgreement.classList.add('error');
        isValid = false;
    } else {
        termsAgreement.classList.remove('error');
    }
    
    if (!isValid) {
        alert('Please fill in all required fields and accept the terms.');
    }
    
    return isValid;
}

// Submit event
function submitEvent() {
    // Get form data
    const formData = new FormData(addEventForm);
    
    // Create event object
    const newEvent = {
        id: eventId++,
        title: formData.get('eventTitle'),
        type: formData.get('eventType'),
        department: formData.get('eventDepartment'),
        date: formData.get('eventDate'),
        time: formData.get('eventTime'),
        location: formData.get('eventLocation'),
        description: formData.get('eventDescription'),
        image: eventImageURL || 'https://source.unsplash.com/300x200/?' + formData.get('eventType'),
        featured: false,
        registrationFee: formData.get('registrationFee') || 'Free',
        capacity: formData.get('eventCapacity') ? parseInt(formData.get('eventCapacity')) : 'Unlimited',
        organizer: formData.get('eventOrganizer'),
        createdAt: new Date().toISOString(),
        status: 'approved' // Changed from 'pending' to 'approved' to make events immediately visible
    };
    
    // In a real application, this would be an API call to save the event
    // For this demo, we'll just add it to the eventsData array
    eventsData.push(newEvent);
    
    // Add notification
    const newNotification = {
        id: Date.now(),
        title: "Event Submitted",
        message: `Your event "${newEvent.title}" has been submitted and is now visible to all users.`,
        time: "Just now",
        read: false
    };
    
    notificationsData.unshift(newNotification);
    updateNotifications();
    
    // Close preview modal
    closeModal(previewModal);
    
    // Show success modal
    successModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
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

// Handle image upload and preview
function handleImageUpload(e) {
    const file = e.target.files[0];
    
    if (file) {
        // Read the file and display preview
        const reader = new FileReader();
        
        reader.onload = function(event) {
            eventImageURL = event.target.result;
            
            imagePreview.innerHTML = `
                <img src="${eventImageURL}" alt="Event Image Preview">
            `;
        };
        
        reader.readAsDataURL(file);
    } else {
        eventImageURL = null;
        imagePreview.innerHTML = '';
    }
}

// Close modal
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Reset form
function resetForm() {
    addEventForm.reset();
    eventImageURL = null;
    imagePreview.innerHTML = '';
}

// Setup Event Listeners
function setupEventListeners() {
    // Preview Event
    previewEventBtn.addEventListener('click', previewEvent);
    
    // Edit Event (return to form)
    editEventBtn.addEventListener('click', () => {
        closeModal(previewModal);
    });
    
    // Confirm and Submit Event
    confirmSubmitBtn.addEventListener('click', submitEvent);
    
    // View Events Button
    viewEventsBtn.addEventListener('click', () => {
        window.location.href = 'events.html';
    });
    
    // Add Another Event Button
    addAnotherEventBtn.addEventListener('click', () => {
        closeModal(successModal);
        resetForm();
    });
    
    // Form Submission
    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        previewEvent();
    });
    
    // Image Upload
    eventImageInput.addEventListener('change', handleImageUpload);
    
    // Modal Close Buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', event => {
        if (event.target === previewModal) {
            closeModal(previewModal);
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

// Helper function: Format date
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 