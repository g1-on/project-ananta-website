const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone  
      : {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: true,
        enum: [
            'Provide a catalog', 
            'Provide an investment plan', 
            'Provide brochures'
        ]
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const ContactSubmission = mongoose.model('ContactSubmission', contactSchema);

module.exports = ContactSubmission;