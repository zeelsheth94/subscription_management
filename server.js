// server.js
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up EJS as the view engine for rendering HTML with dynamic content
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files (your CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public'))); // Assuming your static files are in a 'public' folder

// Session middleware configuration
app.use(session({
    secret: 'your_super_secret_key', // Replace with a strong, random secret
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Simple "middleware" to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next(); // User is authenticated, proceed to the next middleware/route handler
    } else {
        // Store a message in the session before redirecting
        req.session.message = 'Please log in first to access the home page.';
        res.redirect('/login'); // Redirect to login page
    }
}

// --- Routes ---

// Root path redirects to home or login based on auth status
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

// Home page - protected
app.get('/home', isAuthenticated, (req, res) => {
    res.render('home'); // Render the home.ejs file
});

// Login page
app.get('/login', (req, res) => {
    const message = req.session.message; // Get the message from session
    delete req.session.message; // Clear the message after displaying it
    res.render('login', { message: message }); // Pass message to the login.ejs template
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // --- In a real application, you'd check these against a database ---
    if (username === 'user' && password === 'pass') { // Dummy credentials
        req.session.userId = username; // Store user ID in session
        res.redirect('/home');
    } else {
        req.session.message = 'Invalid username or password.';
        res.redirect('/login');
    }
});

// Register page (no specific logic for this example, just rendering)
app.get('/register', (req, res) => {
    res.render('register');
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/login');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});