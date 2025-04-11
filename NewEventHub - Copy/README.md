# EventHub - Zeal Institute Event Management Platform

A modern, responsive web application for Zeal Institute that serves as a centralized platform for students to discover, register, and manage college events.

## Features

- **Event Discovery**: Browse and search for upcoming events at Zeal Institute
- **Event Filtering**: Filter events by type, date, and department
- **Event Registration**: Register for events with a simple form
- **E-Pass Generation**: Automatically generate and download e-passes upon registration
- **Event Creation**: Allow students to add and publish their own events
- **User Profiles**: View registered events and manage personal information
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Notifications**: Stay updated with event changes and registration status

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **External Libraries**:
  - Font Awesome (icons)
  - jsPDF (for e-pass generation)
  - FullCalendar.js (for calendar view)
  - HTML2Canvas (for rendering e-passes)

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd eventhub
   ```

3. Open the `index.html` file in your browser, or set up a local server.

## Project Structure

- `index.html` - Main homepage
- `css/` - Style files
  - `styles.css` - Main styles
  - `profile.css` - Profile page styles
  - `add-event.css` - Add event page styles
- `js/` - JavaScript files
  - `data.js` - Mock data for the application
  - `main.js` - Main functionality for the homepage
  - `profile.js` - Profile page functionality
  - `add-event.js` - Add event page functionality
- `pages/` - Additional HTML pages
  - `add-event.html` - Page for adding new events
  - `profile.html` - User profile page
  - `events.html` - Event listings page
- `images/` - Image assets

## Usage

### Browsing Events
- Use the filters at the top of the page to narrow down events
- Toggle between grid, list, and calendar views
- Click on an event card to view more details

### Registering for Events
- Click the "Register" button on any event card
- Fill in your details in the registration form
- Submit to receive your e-pass automatically

### Adding Events
- Navigate to the "Add Event" page
- Fill in the event details and submit
- Events will be reviewed before being published

### Managing Profile
- View your registered events
- View and manage your created events
- Download e-passes for registered events
- Update your account settings

## Future Enhancements

- Backend integration for persistent storage
- Authentication and user accounts
- QR code scanning for event check-in
- Event analytics dashboard
- Advanced search capabilities

## Credits

- Images from [Unsplash](https://unsplash.com)
- Icons from [Font Awesome](https://fontawesome.com)
- Fonts from [Google Fonts](https://fonts.google.com)

## License

This project is for educational purposes only. All rights reserved. 