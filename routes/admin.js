const express = require('express');
const router = express.Router();
const ContactSubmission = require('../models/contact');

// Middleware to check if the admin is logged in
const authCheck = (req, res, next) => {
    if (req.session.isAdmin) {
        next(); // If logged in, proceed
    } else {
        res.redirect('/admin/login'); // If not, redirect to login
    }
};

// GET /admin/login - Show login page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// POST /admin/login - Handle login attempt
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // IMPORTANT: In a real app, hash and salt passwords! This is for demonstration only.
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        req.session.isAdmin = true;
        res.redirect('/admin/dashboard');
    } else {
        res.render('login', { error: 'Invalid username or password.' });
    }
});

// GET /admin/dashboard - Show all submissions (protected)
router.get('/dashboard', authCheck, async (req, res) => {
    try {
        const submissions = await ContactSubmission.find().sort({ submittedAt: -1 });
        res.render('dashboard', { submissions });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).send("Error fetching data.");
    }
});

// GET /admin/logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/admin/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/admin/login');
    });
});


module.exports = router;