const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify event type'],
    enum: ['cultural', 'technical', 'sports', 'workshop', 'seminar', 'educational']
  },
  department: {
    type: String,
    required: [true, 'Please specify department'],
    enum: ['computer', 'mechanical', 'electrical', 'civil', 'management', 'all']
  },
  date: {
    type: Date,
    required: [true, 'Please add event date']
  },
  time: {
    type: String,
    required: [true, 'Please add event time']
  },
  location: {
    type: String,
    required: [true, 'Please add event location']
  },
  description: {
    type: String,
    required: [true, 'Please add event description'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  featured: {
    type: Boolean,
    default: false
  },
  registrationFee: {
    type: String,
    default: 'Free'
  },
  capacity: {
    type: mongoose.Schema.Types.Mixed, // Can be number or 'Unlimited'
    default: 'Unlimited'
  },
  organizer: {
    type: String,
    required: [true, 'Please add event organizer']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema); 