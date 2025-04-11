const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Please add a full name']
  },
  studentId: {
    type: String,
    required: [true, 'Please add a student ID']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^[0-9]{10}$/, 'Please add a valid phone number']
  },
  epassCode: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['registered', 'cancelled', 'attended'],
    default: 'registered'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

// Generate e-pass code
RegistrationSchema.pre('save', function(next) {
  // Generate a unique epassCode if it doesn't exist
  if (!this.epassCode) {
    this.epassCode = `EH-${this.event}-${Date.now().toString().slice(-6)}`;
  }
  next();
});

// Prevent duplicate registrations
RegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema); 