require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const statesRoutes = require('./routes/statesRoutes');

const app = express();
const port = process.env.PORT || 3000; // Set the port from environment variable or default to 3000

app.use(express.json()); // Middleware for parsing JSON bodies

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URI, { // Connect to MongoDB using the URI from environment variable
    writeConcern: {
        w: "majority" // Set write concern to 'majority'
    }
}).then(() => {
    console.log('MongoDB connected...'); // Log successful MongoDB connection
}).catch(err => {
    console.error('Connection error:', err); // Log MongoDB connection error
});

// Use the states routes
app.use('/states', statesRoutes);

// Serve static files from a public directory (optional)
app.use(express.static('public'));

// Root endpoint GET request should return an HTML document
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route to handle undefined routes and return a 404 HTML document
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`); // Log the port the server is running on
});
