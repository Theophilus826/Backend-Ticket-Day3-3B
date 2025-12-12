const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        product: {
            type: String,
            required: [true, 'Please select a product'],
            enum: ['iphone', 'macbook pro', 'hp elite', 'hp probook'],
            trim: true // remove extra spaces
        },
        description: {
            type: String,
            required: [true, 'Please describe the issue'],
            trim: true, // removes leading/trailing spaces
            minlength: [10, 'Description should be at least 10 characters'] // optional
        },
        status: {
            type: String,
            enum: ['new', 'open', 'closed'],
            default: 'new',
            lowercase: true // ensures consistency
        }
    },
    {
        timestamps: true
    }
);

// Optional: create an index for faster queries by user and status
ticketSchema.index({ user: 1, status: 1 });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
