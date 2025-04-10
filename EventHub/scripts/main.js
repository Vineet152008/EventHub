/**
 * EventHub - Main JavaScript
 * Handles all interactive functionality for the EventHub platform
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const eventCards = document.querySelectorAll('.event-card');
    const eventTypeFilter = document.getElementById('event-type');
    const eventDepartmentFilter = document.getElementById('event-department');
    const eventDateFilter = document.getElementById('event-date');
    const eventSearch = document.getElementById('event-search');
    const eventModal = document.getElementById('event-modal');
    const successModal = document.getElementById('success-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    const registrationForm = document.getElementById('registration-form');
    const loadMoreButton = document.querySelector('.load-more .btn');

    // Mobile Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Event Filtering Logic
    function filterEvents() {
        const typeValue = eventTypeFilter.value;
        const departmentValue = eventDepartmentFilter.value;
        const dateValue = eventDateFilter.value;
        const searchValue = eventSearch.value.toLowerCase();

        eventCards.forEach(card => {
            // Get data attributes
            const type = card.getAttribute('data-type');
            const department = card.getAttribute('data-department');
            
            // Get event title for search
            const title = card.querySelector('h3').textContent.toLowerCase();
            
            // Check if card matches all filter criteria
            const typeMatch = typeValue === 'all' || type === typeValue;
            const departmentMatch = departmentValue === 'all' || department === departmentValue;
            // Date filtering would typically use actual dates, simplified for demo
            const dateMatch = dateValue === 'all' || true; 
            const searchMatch = searchValue === '' || title.includes(searchValue);
            
            // Show or hide card based on all criteria
            if (typeMatch && departmentMatch && dateMatch && searchMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Set up event listeners for filters
    if (eventTypeFilter) eventTypeFilter.addEventListener('change', filterEvents);
    if (eventDepartmentFilter) eventDepartmentFilter.addEventListener('change', filterEvents);
    if (eventDateFilter) eventDateFilter.addEventListener('change', filterEvents);
    if (eventSearch) {
        eventSearch.addEventListener('input', filterEvents);
        // Prevent form submission on enter
        eventSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') e.preventDefault();
        });
    }

    // Modal handling
    function openModal(modal) {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    // Close button for modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Event details view
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventId = button.getAttribute('data-id');
            // In a real implementation, we would fetch event details from the server
            // For this demo, we'll use hardcoded data based on the button's data-id
            populateEventModal(eventId);
            openModal(eventModal);
        });
    });

    // Populate the event modal with event information
    function populateEventModal(eventId) {
        // This would typically come from an API in a real implementation
        const eventDetails = getEventDetailsById(eventId);
        
        // Populate modal with event details
        document.getElementById('modal-title').textContent = eventDetails.title;
        document.getElementById('modal-badge').textContent = eventDetails.type;
        document.getElementById('modal-badge').className = `event-badge ${eventDetails.type.toLowerCase()}`;
        document.getElementById('modal-image').src = eventDetails.image;
        document.getElementById('modal-image').alt = eventDetails.title;
        document.getElementById('modal-datetime').textContent = eventDetails.dateTime;
        document.getElementById('modal-location').textContent = eventDetails.location;
        document.getElementById('modal-organizer').textContent = eventDetails.organizer;
        document.getElementById('modal-description').textContent = eventDetails.description;
    }

    // Mock function to get event details by ID
    function getEventDetailsById(id) {
        // Mock data for demonstration
        const eventDatabase = {
            '1': {
                title: 'Annual Tech Conference',
                type: 'Academic',
                image: 'https://via.placeholder.com/600x300?text=Tech+Conference',
                dateTime: 'October 15, 2023 • 10:00 AM - 4:00 PM',
                location: 'Main Auditorium, Building A',
                organizer: 'Engineering Department',
                description: 'Join us for the annual technology conference featuring talks from industry professionals, hands-on workshops, and networking opportunities. This year\'s theme focuses on AI and machine learning technologies. Students will have the chance to present their projects and interact with potential employers.'
            },
            '2': {
                title: 'Annual Cultural Night',
                type: 'Cultural',
                image: 'https://via.placeholder.com/600x300?text=Cultural+Night',
                dateTime: 'October 20, 2023 • 6:00 PM - 10:00 PM',
                location: 'Open Air Theatre',
                organizer: 'Arts Department',
                description: 'Experience the rich diversity of cultures through performances, art exhibitions, and food stalls at our annual cultural night. This event celebrates traditions from around the world with music, dance, and theatrical performances by talented students.'
            },
            '3': {
                title: 'Inter-College Sports Tournament',
                type: 'Sports',
                image: 'https://via.placeholder.com/600x300?text=Sports+Tournament',
                dateTime: 'October 25, 2023 • 9:00 AM - 5:00 PM',
                location: 'College Grounds',
                organizer: 'Sports Committee',
                description: 'Cheer for your favorite teams in this action-packed inter-college sports tournament. Events include basketball, football, volleyball, and track and field competitions. Athletes from over 10 colleges will be participating.'
            },
            '4': {
                title: 'Entrepreneurship Workshop',
                type: 'Workshop',
                image: 'https://via.placeholder.com/600x300?text=Business+Workshop',
                dateTime: 'October 30, 2023 • 2:00 PM - 5:00 PM',
                location: 'Seminar Hall 2',
                organizer: 'Business Department',
                description: 'Learn the fundamentals of starting a business in this interactive workshop. Topics include business planning, funding strategies, marketing, and legal considerations. Guest speakers include successful alumni entrepreneurs who will share their experiences.'
            },
            '5': {
                title: 'Latest Advancements in Biotechnology',
                type: 'Seminar',
                image: 'https://via.placeholder.com/600x300?text=Science+Seminar',
                dateTime: 'November 5, 2023 • 11:00 AM - 1:00 PM',
                location: 'Science Block Auditorium',
                organizer: 'Science Department',
                description: 'Discover the cutting-edge developments in biotechnology and their applications in medicine, agriculture, and environmental conservation. The seminar will feature presentations from leading researchers and faculty members in the field.'
            },
            '6': {
                title: '24-Hour Coding Hackathon',
                type: 'Academic',
                image: 'https://via.placeholder.com/600x300?text=Coding+Hackathon',
                dateTime: 'November 10, 2023 • Starts at 9:00 AM',
                location: 'Computer Lab',
                organizer: 'Computer Science Department',
                description: 'Put your coding skills to the test in this 24-hour hackathon. Participants will work in teams to develop innovative solutions to real-world problems. Prizes will be awarded for the best projects, and industry experts will serve as judges.'
            }
        };
        
        return eventDatabase[id] || {
            title: 'Event Not Found',
            type: 'Unknown',
            image: 'https://via.placeholder.com/600x300?text=Event+Not+Found',
            dateTime: 'Date and time not available',
            location: 'Location not specified',
            organizer: 'Organizer information unavailable',
            description: 'No description available for this event.'
        };
    }

    // Registration form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real application, we would submit the form data to the server here
            
            // Get values for confirmation
            const name = document.getElementById('reg-name').value;
            const studentId = document.getElementById('reg-id').value;
            
            // Update success modal with registration details
            document.getElementById('epass-name').textContent = name;
            document.getElementById('epass-id').textContent = studentId;
            document.getElementById('epass-event').textContent = document.getElementById('modal-title').textContent;
            document.getElementById('epass-date').textContent = document.getElementById('modal-datetime').textContent.split('•')[0].trim();
            document.getElementById('epass-time').textContent = document.getElementById('modal-datetime').textContent.split('•')[1].trim();
            document.getElementById('epass-venue').textContent = document.getElementById('modal-location').textContent;
            
            // Close event modal and open success modal
            closeModal(eventModal);
            openModal(successModal);
        });
    }

    // Load more events functionality
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            // In a real application, this would fetch more events from the server
            // For this demo, we'll simulate adding more events
            loadMoreButton.textContent = 'Loading...';
            
            // Simulate loading delay
            setTimeout(() => {
                // Add 3 more events to the grid (in a real app, this would come from the server)
                const eventGrid = document.querySelector('.event-grid');
                
                // Create new event cards (using the template of existing cards for demo)
                for (let i = 0; i < 3; i++) {
                    // Clone one of the existing cards for demonstration
                    const originalCard = eventCards[i % eventCards.length];
                    const newCard = originalCard.cloneNode(true);
                    
                    // Update some properties to make it look different
                    const cardTitle = newCard.querySelector('h3');
                    cardTitle.textContent = 'New Event: ' + cardTitle.textContent;
                    
                    // Update the event date to future dates
                    const day = newCard.querySelector('.event-date .day');
                    const month = newCard.querySelector('.event-date .month');
                    day.textContent = parseInt(day.textContent) + 30;
                    
                    // Make sure the new card gets its click handler
                    const viewButton = newCard.querySelector('.view-details');
                    const newEventId = parseInt(viewButton.getAttribute('data-id')) + 10;
                    viewButton.setAttribute('data-id', newEventId);
                    viewButton.addEventListener('click', () => {
                        populateEventModal(newEventId);
                        openModal(eventModal);
                    });
                    
                    // Add new card to the grid
                    eventGrid.appendChild(newCard);
                }
                
                // Update load more button
                loadMoreButton.textContent = 'No More Events';
                loadMoreButton.disabled = true;
                
                // Re-apply filters to include new events
                filterEvents();
            }, 1000);
        });
    }

    // Notification system (simplified)
    const notificationIcon = document.querySelector('.notification');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', (e) => {
            // Prevent the dropdown from closing when clicking inside
            e.stopPropagation();
            
            // Toggle dropdown visibility
            const dropdown = notificationIcon.querySelector('.notification-dropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close notification dropdown when clicking elsewhere
        document.addEventListener('click', () => {
            const dropdown = notificationIcon.querySelector('.notification-dropdown');
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            }
        });
    }

    // Initialize page
    filterEvents();

    // For demonstration: add a real-time notification after 10 seconds
    setTimeout(() => {
        // Create a notification dot animation
        const notificationCount = document.querySelector('.notification-count');
        const currentCount = parseInt(notificationCount.textContent);
        notificationCount.textContent = currentCount + 1;
        
        // Flash animation
        notificationCount.style.animation = 'flash 1s ease';
        setTimeout(() => {
            notificationCount.style.animation = '';
        }, 1000);
        
        // Add new notification to dropdown
        const dropdown = document.querySelector('.notification-dropdown');
        const newNotification = document.createElement('div');
        newNotification.className = 'notification-item';
        newNotification.innerHTML = `
            <p>New event added: Photography Workshop</p>
            <small>Just now</small>
        `;
        
        // Insert at the top
        dropdown.insertBefore(newNotification, dropdown.firstChild);
    }, 10000);
}); 