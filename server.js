const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins during development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Contact form submission route
app.post('/api/contact', async (req, res) => {
    try {
        console.log('Contact form request received');
        console.log('Request body:', req.body);

        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Here you would typically save the message to your database
        // For now, we'll just log it and send a success response
        console.log('Contact form submission:', { name, email, message });

        res.status(200).json({ message: 'Message received successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to process contact form' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 