const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        const user = await User.findOne({ email });
        console.log('Found user:', user ? 'Yes' : 'No');

        if (user) {
            console.log('Comparing passwords...');
            const isMatch = await user.matchPassword(password);
            console.log('Password match:', isMatch);

            if (isMatch) {
                const token = generateToken(user._id);
                console.log('Generated token:', token);

                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token
                });
            } else {
                console.log('Password does not match');
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            console.log('User not found');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        console.log('Profile route - User ID:', req.user._id);
        const user = await User.findById(req.user._id);
        console.log('Found user:', user);
        console.log('User billing addresses:', user.billingAddresses);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
                billingAddresses: user.billingAddresses
            });
        } else {
            console.log('User not found');
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile route error:', error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update user billing address
// @route   PUT /api/users/profile/billing
// @access  Private
router.put('/profile/billing', auth, async (req, res) => {
    try {
        const { street, city, state, zipCode, country } = req.body;
        console.log('Received billing data:', { street, city, state, zipCode, country });

        const user = await User.findById(req.user._id);
        console.log('Found user for billing update:', user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new address
        const newAddress = {
            street,
            city,
            state,
            zipCode,
            country,
            isDefault: user.billingAddresses.length === 0
        };

        console.log('New address to be added:', newAddress);

        user.billingAddresses.push(newAddress);
        await user.save();
        console.log('Updated user with new billing address:', user);

        res.json({
            message: 'Billing address added successfully',
            billingAddresses: user.billingAddresses
        });
    } catch (error) {
        console.error('Error in billing update:', error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Set default billing address
// @route   PUT /api/users/profile/billing/:addressId/default
// @access  Private
router.put('/profile/billing/:addressId/default', auth, async (req, res) => {
    try {
        const { addressId } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Reset all addresses to non-default
        user.billingAddresses.forEach(address => {
            address.isDefault = false;
        });

        // Set the selected address as default
        if (user.billingAddresses[addressId]) {
            user.billingAddresses[addressId].isDefault = true;
            await user.save();
            res.json({
                message: 'Default address updated successfully',
                billingAddresses: user.billingAddresses
            });
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Generate JWT
const generateToken = (id) => {
    console.log('Generating token for user ID:', id);
    const token = jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d'
    });
    console.log('Generated token:', token);
    return token;
};

module.exports = router; 