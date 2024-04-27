require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const statesRoutes = require('./routes/statesRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all requests

app.use(express.json()); // Middleware for parsing JSON bodies

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URI, {
    writeConcern: {
        w: "majority"
    }
}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.error('Connection error:', err);
});

// Serve static files from the public directory
app.use(express.static('public'));

// Use the states routes
app.use('/states', statesRoutes);

// Root endpoint GET request should return an HTML document
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route to handle all undefined routes and return a 404 HTML document
app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
