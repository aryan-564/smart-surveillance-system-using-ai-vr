const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    type: { type: String, enum: ['Working', 'Break'], required: true },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Number, required: true }, // duration in seconds
    employeeId: { type: String, default: 'employee_1' } // simplistic tracking
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);