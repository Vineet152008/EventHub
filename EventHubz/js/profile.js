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
    
    // Get event type name and color
    const eventType = eventTypes.find(t => t.id === event.type);
    const eventTypeName = eventType ? eventType.name : 'Event';
    const colors = {
        'technical': '#3498db',
        'cultural': '#e74c3c',
        'workshop': '#9b59b6',
        'sports': '#2ecc71',
        'seminar': '#f39c12',
        'educational': '#1abc9c'
    };
    const bgColor = colors[event.type] || '#3498db';
    
    // Generate a proper event image if none exists
    if (!event.image || event.image.includes('placeholder') || event.image.includes('unsplash')) {
        // Create a dynamic logo for the event
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 250;
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, bgColor);
        gradient.addColorStop(1, adjustColor(bgColor, -30));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add decorative circles
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
        
        const icon = icons[event.type] || '📅';
        
        // Draw icon in the center
        ctx.font = '80px Arial, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, canvas.width / 2, canvas.height / 2);
        
        // Set the event image
        event.image = canvas.toDataURL('image/png');
    }
    
    // Create HTML
    eventItem.innerHTML = `
        <div class="event-item-image">
            <img src="${event.image}" alt="${event.title}" loading="lazy">
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
    
    // Get color for the event type
    const colors = {
        'technical': '#3498db',
        'cultural': '#e74c3c',
        'workshop': '#9b59b6',
        'sports': '#2ecc71',
        'seminar': '#f39c12',
        'educational': '#1abc9c'
    };
    const bgColor = colors[event.type] || '#3498db';
    
    ePassCard.innerHTML = `
        <div class="e-pass-header" style="background-color: ${bgColor};">
            <h3>Event E-Pass</h3>
        </div>
        <div class="e-pass-body">
            <div class="e-pass-event-logo" style="text-align: center; margin-bottom: 15px;">
                <img src="${event.image}" alt="${event.title}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 3px solid #f0f0f0;">
            </div>
            <h3 class="e-pass-event-title">${event.title}</h3>
            <div class="e-pass-details">
                <p><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-user"></i> ${userProfile.name}</p>
            </div>
            <div class="e-pass-code" style="background-color: #f5f5f5; padding: 8px; font-family: monospace; border-radius: 6px; font-size: 0.9rem; text-align: center; margin-top: 10px;">${registration.epassCode}</div>
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
    
    // Get the color for the event type
    const colors = {
        'technical': '#3498db',
        'cultural': '#e74c3c',
        'workshop': '#9b59b6',
        'sports': '#2ecc71',
        'seminar': '#f39c12',
        'educational': '#1abc9c'
    };
    const bgColor = colors[event.type] || '#3498db';
    
    // Create e-pass preview
    modalEPassPreview.innerHTML = `
        <div class="e-pass">
            <div class="e-pass-header" style="background-color: ${bgColor};">
                <h3>Zeal Institute EventHub</h3>
                <p>E-Pass for Event</p>
            </div>
            <div class="e-pass-event">
                <img class="event-logo" src="${event.image}" alt="${event.title}">
                <h2>${event.title}</h2>
                <p><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
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
    
    // Set current e-pass for download
    const downloadBtn = document.getElementById('downloadEPass');
    downloadBtn.dataset.eventId = event.id;
    
    downloadBtn.addEventListener('click', () => {
        downloadEPass(event.id);
    });
    
    // Add event listener to the close button
    const closeBtn = modalEPassPreview.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        closeModal(ePassModal);
    });
}

// Download E-Pass as PDF
function downloadEPass(eventId) {
    const event = eventsData.find(e => e.id === parseInt(eventId));
    if (!event) return;
    
    // Create a temporary container for the certificate to be downloaded
    const tempContainer = document.createElement('div');
    document.body.appendChild(tempContainer);
    
    // Get registration
    const registration = mockRegistrations.find(reg => reg.eventId === event.id);
    
    // Format date for certificate
    const eventDate = new Date(event.date);
    const formattedDate = `${eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })}`;
    
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
                <p style="margin: 5px 0 0; font-size: 18px;">E-Pass Certificate</p>
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
                        ${formattedDate}
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
                        ${userProfile.name}
                    </p>
                    <p style="margin: 10px 0; font-size: 16px;">
                        <strong style="display: inline-block; width: 100px; color: #555;">Student ID:</strong> 
                        ${userProfile.id}
                    </p>
                    <p style="margin: 10px 0; font-size: 16px;">
                        <strong style="display: inline-block; width: 100px; color: #555;">Email:</strong> 
                        ${userProfile.email}
                    </p>
                    <p style="margin: 10px 0; font-size: 16px;">
                        <strong style="display: inline-block; width: 100px; color: #555;">Phone:</strong> 
                        ${userProfile.phone}
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
                ">${registration.epassCode}</p>
            </div>
            
            <div style="text-align: center; color: #777; font-size: 14px;">
                <p style="margin: 5px 0;">Present this e-pass at the event entrance</p>
                <p style="margin: 5px 0;">Generated on: ${new Date(registration.registrationDate).toLocaleString()}</p>
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
        
        // Add notification
        const newNotification = {
            id: Date.now(),
            title: "E-Pass Downloaded",
            message: `Your e-pass for "${event.title}" has been downloaded successfully.`,
            time: "Just now",
            read: false
        };
        
        notificationsData.unshift(newNotification);
        updateNotifications();
    }).catch(err => {
        console.error("Error generating PDF:", err);
        alert("There was an error generating the PDF. Please try again.");
    });
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