require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
// 1. Import connect-mongo
const MongoStore = require('connect-mongo');

// ... (imports for routes, etc.)

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err));

// --- Middleware ---
// ... (app.use(express.json), etc.)

// --- Session Middleware ---
// 2. Update the session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Set to false for best practice with login sessions
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI 
    }),
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // e.g., 1 day
    }
}));


// --- View Engine Setup ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- Routes ---
app.use('/api', apiRoutes);       // Use API routes for paths starting with /api
app.use('/admin', adminRoutes);   // Use Admin routes for paths starting with /admin

// --- Root Redirect ---
// Redirect the base URL to the main site page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
