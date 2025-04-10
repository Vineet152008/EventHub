# EventHub

EventHub is a centralized platform designed to help college students at Most College stay informed about and participate in campus events. This project addresses the problem of scattered event information by bringing everything together in one place.

## Features

- **Event Listing**: View all upcoming and current campus events with key details
- **Filtering**: Filter events by type, date, or department
- **Real-Time Notifications**: Receive notifications about new events or updates
- **Event Registration**: Register for events and download e-passes directly

## Project Structure

```
EventHub/
├── index.html            # Main HTML file
├── styles/
│   └── main.css          # CSS styles for the platform
├── scripts/
│   └── main.js           # JavaScript functionality
├── assets/               # Images and other static resources
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Basic web server (for local development)

### Installation

1. Clone the repository or download the files
2. Open the project in your code editor
3. Launch the site with a local server or simply open `index.html` in a browser

### Local Development

To run the site locally with live reloading:

```bash
# If you have Python installed
python -m http.server

# If you have Node.js installed
npx http-server
```

Then open your browser to `http://localhost:8000` or the port shown in your console.

## Usage

### Browsing Events

- The homepage displays upcoming events in a grid view
- Use the filters at the top to narrow down events by type, department, or date
- Use the search box to find events by keyword

### Event Details & Registration

1. Click "View Details" on any event card to see full information
2. Fill out the registration form to sign up for the event
3. After registering, you'll receive an e-pass that you can download or email to yourself

### Notifications

- The bell icon in the header shows real-time notifications
- Click the icon to view all recent updates about events

## Customization

### Adding New Events

In a production environment, you would connect to a backend API to fetch events. For the current frontend-only version:

1. Add new event cards to the HTML in the `.event-grid` section
2. Follow the existing structure, including data attributes
3. Add corresponding event details to the `eventDatabase` object in `main.js`

### Styling

- The site uses CSS variables for easy theming
- Major color and styling variables are defined at the top of `main.css`
- Update the `:root` section to change colors, fonts, and spacing throughout the site

## Browser Compatibility

EventHub is designed to work on all modern browsers and is responsive for mobile devices. The site has been tested on:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Deployment

To deploy this site to a production environment:

1. Upload all files to your web hosting service
2. Ensure that the directory structure is maintained
3. For a real production environment, you would connect the frontend to a backend API for data management

## Future Enhancements

- User accounts and authentication
- Calendar view for events
- Event recommendations based on user preferences
- Integration with college email system
- Push notifications through browsers
- QR code scanning at event entrances

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Font Awesome for icons
- Google Fonts for typography
- Placeholder.com for placeholder images during development 