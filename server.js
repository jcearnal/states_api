require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const statesRoutes = require('./routes/statesRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware for parsing JSON bodies

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: "majority"  
    }
}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.error('Connection error:', err);
});

// Use the states routes
app.use('/states', statesRoutes);

// Basic route for homepage
app.get('/', (req, res) => {
    res.send('Final Project');
});

// Catch all for non-existent routes
app.use((req, res) => {
    res.status(404).json({ error: "404 Not Found" });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
