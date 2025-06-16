const express = require('express');
const router = express.Router();
const ContactSubmission = require('../models/contact');


// POST /api/contact - Receives form submissions
router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
        }

        const newSubmission = new ContactSubmission({
            name,
            email,
            phone,
            message
        });

        await newSubmission.save();

        res.status(201).json({ success: true, message: 'Message received successfully!' });

    } catch (error) {
        console.error("Error saving contact submission:", error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

module.exports = router;