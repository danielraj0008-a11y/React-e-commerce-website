const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log('Auth Header:', authHeader);

        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('Extracted Token:', token);

        if (!token) {
            console.log('No token found after Bearer removal');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        console.log('Verifying token with secret:', process.env.JWT_SECRET || 'your_jwt_secret');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.id);
        console.log('Found user:', user);

        if (!user) {
            console.log('No user found with ID:', decoded.id);
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth; 