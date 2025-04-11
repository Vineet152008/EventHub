// Mock Event Data
const eventsData = [
    {
        id: 1,
        title: "Annual Tech Fest",
        type: "technical",
        department: "computer",
        date: "2023-12-15",
        time: "10:00 AM - 6:00 PM",
        location: "Main Auditorium, Zeal Campus",
        description: "Join us for the biggest technical fest of the year. Showcasing the latest innovations, coding competitions, project exhibitions, and guest lectures from industry experts.",
        image: "images/tech-fest.jpg",
        featured: true,
        registrationFee: "₹200",
        capacity: 500,
        organizer: "Computer Science Department"
    },
    {
        id: 2,
        title: "Cultural Night: Rhythms",
        type: "cultural",
        department: "all",
        date: "2023-11-30",
        time: "5:00 PM - 10:00 PM",
        location: "College Ground, Zeal Campus",
        description: "Experience a night full of music, dance, and culture. Student performances, celebrity appearances, and much more. Don't miss this spectacular night!",
        image: "images/cultural-night.jpg",
        featured: true,
        registrationFee: "₹150",
        capacity: 1000,
        organizer: "Cultural Committee"
    },
    {
        id: 3,
        title: "AI Workshop",
        type: "workshop",
        department: "computer",
        date: "2023-12-05",
        time: "2:00 PM - 5:00 PM",
        location: "Seminar Hall B, Zeal Campus",
        description: "Learn the basics of Artificial Intelligence and Machine Learning in this hands-on workshop. Bring your laptops and get ready to dive into the world of AI.",
        image: "images/ai-workshop.jpg",
        featured: false,
        registrationFee: "₹100",
        capacity: 50,
        organizer: "AI Club"
    },
    {
        id: 4,
        title: "Inter-College Cricket Tournament",
        type: "sports",
        department: "all",
        date: "2023-12-20",
        time: "9:00 AM - 5:00 PM",
        location: "Sports Ground, Zeal Campus",
        description: "Compete against teams from other colleges in this exciting cricket tournament. Form your team and register now to show off your cricketing skills.",
        image: "images/cricket.jpg",
        featured: true,
        registrationFee: "₹500 per team",
        capacity: 16,
        organizer: "Sports Committee"
    },
    {
        id: 5,
        title: "Industry Visit: Infosys",
        type: "educational",
        department: "computer",
        date: "2023-12-10",
        time: "8:00 AM - 4:00 PM",
        location: "Infosys Campus, Hinjewadi",
        description: "Get an opportunity to visit the Infosys campus and learn about their working environment, technologies, and career opportunities.",
        image: "images/industry-visit.jpg",
        featured: false,
        registrationFee: "₹300",
        capacity: 60,
        organizer: "Training & Placement Cell"
    },
    {
        id: 6,
        title: "Entrepreneurship Summit",
        type: "seminar",
        department: "management",
        date: "2023-12-08",
        time: "11:00 AM - 3:00 PM",
        location: "Conference Hall, Zeal Campus",
        description: "Meet successful entrepreneurs, learn about startup ecosystems, and get insights on how to start your own business venture.",
        image: "images/entrepreneurship.jpg",
        featured: true,
        registrationFee: "₹150",
        capacity: 200,
        organizer: "E-Cell"
    },
    {
        id: 7,
        title: "Mechanical Project Exhibition",
        type: "technical",
        department: "mechanical",
        date: "2023-12-12",
        time: "10:00 AM - 4:00 PM",
        location: "Mechanical Block, Zeal Campus",
        description: "Exhibition of innovative mechanical engineering projects by students. Come and witness the future of mechanical engineering.",
        image: "images/mechanical.jpg",
        featured: false,
        registrationFee: "Free",
        capacity: 300,
        organizer: "Mechanical Engineering Department"
    },
    {
        id: 8,
        title: "Dance Competition: Groove",
        type: "cultural",
        department: "all",
        date: "2023-12-18",
        time: "4:00 PM - 8:00 PM",
        location: "Auditorium, Zeal Campus",
        description: "Showcase your dancing skills in this grand competition. Solo, duo, and group categories available. Great prizes to be won!",
        image: "images/dance.jpg",
        featured: false,
        registrationFee: "₹100 per participant",
        capacity: 100,
        organizer: "Dance Club"
    },
    {
        id: 9,
        title: "Civil Engineering Workshop",
        type: "workshop",
        department: "civil",
        date: "2023-12-14",
        time: "11:00 AM - 3:00 PM",
        location: "Civil Block, Zeal Campus",
        description: "Learn about modern construction techniques and software tools used in civil engineering through this practical workshop.",
        image: "images/civil.jpg",
        featured: false,
        registrationFee: "₹120",
        capacity: 50,
        organizer: "Civil Engineering Department"
    },
    {
        id: 10,
        title: "National Conference on Emerging Technologies",
        type: "seminar",
        department: "all",
        date: "2023-12-22",
        time: "9:00 AM - 5:00 PM",
        location: "Main Auditorium, Zeal Campus",
        description: "A national level conference featuring speakers from various technological fields discussing the latest trends and future technologies.",
        image: "images/conference.jpg",
        featured: true,
        registrationFee: "₹250",
        capacity: 400,
        organizer: "Research & Development Cell"
    },
    {
        id: 11,
        title: "Hackathon: CodeForZeal",
        type: "technical",
        department: "computer",
        date: "2023-12-16",
        time: "9:00 AM (24 Hours)",
        location: "Computer Labs, Zeal Campus",
        description: "A 24-hour coding marathon to build innovative solutions for real-world problems. Form a team and put your coding skills to the test.",
        image: "images/hackathon.jpg",
        featured: true,
        registrationFee: "₹200 per team",
        capacity: 30,
        organizer: "Coding Club"
    },
    {
        id: 12,
        title: "Football Tournament",
        type: "sports",
        department: "all",
        date: "2023-12-25",
        time: "2:00 PM - 6:00 PM",
        location: "Sports Ground, Zeal Campus",
        description: "Inter-departmental football tournament. Form your department's team and compete for the Zeal Football Trophy.",
        image: "images/football.jpg",
        featured: false,
        registrationFee: "₹400 per team",
        capacity: 12,
        organizer: "Sports Committee"
    }
];

// Featured Events
const featuredEvents = eventsData.filter(event => event.featured);

// Mock Notifications
const notificationsData = [
    {
        id: 1,
        title: "New Event Added",
        message: "Annual Tech Fest registration is now open!",
        time: "2 hours ago",
        read: false
    },
    {
        id: 2,
        title: "Registration Closing Soon",
        message: "AI Workshop registration closes tomorrow",
        time: "5 hours ago",
        read: false
    },
    {
        id: 3,
        title: "Event Update",
        message: "Cultural Night venue changed to College Ground",
        time: "1 day ago",
        read: true
    }
];

// User Registration Data
const userRegistrations = [];

// College Departments
const departments = [
    { id: "computer", name: "Computer Science Engineering" },
    { id: "mechanical", name: "Mechanical Engineering" },
    { id: "electrical", name: "Electrical Engineering" },
    { id: "civil", name: "Civil Engineering" },
    { id: "management", name: "Management Studies" },
    { id: "all", name: "All Departments" }
];

// Event Types
const eventTypes = [
    { id: "cultural", name: "Cultural" },
    { id: "technical", name: "Technical" },
    { id: "sports", name: "Sports" },
    { id: "workshop", name: "Workshop" },
    { id: "seminar", name: "Seminar" },
    { id: "educational", name: "Educational" }
];

// Mock User Profile Data
const userProfile = {
    id: "ST2023001",
    name: "John Doe",
    email: "john.doe@zeal.edu.in",
    department: "computer",
    phone: "+91 9876543210",
    registeredEvents: [1, 3, 6]
}; 