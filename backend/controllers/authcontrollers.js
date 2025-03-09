const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    try {
        const { email, username, password, phone, role } = req.body; // Accept role if provided

        // Check if user exists
        const userExists = await userModel.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            console.log('User with the credentials already exists.');
            return res.json({ success: false, message: 'User with the credentials already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user
        const newUser = new userModel({
            email,
            username,
            password: hashedPassword,
            phone,
            role: role || 'user' // Default to 'user' if role is not provided
        });
        await newUser.save();

        // Generate JWT token
        const jwtToken = jwt.sign(
            { username: newUser.username, _id: newUser._id, role: newUser.role }, // Include role
            process.env.SECRET_KEY,
            { expiresIn: '12h' }
        );

        console.log('Sign up successful');
        return res.json({
            success: true,
            message: 'Signup successful!',
            token: jwtToken,
            username: newUser.username,
            role: newUser.role,
            cart: newUser.cart,
        });
    } catch (error) {
        console.log('An error occurred: ' + error);
        return res.json({ success: false, message: 'An unexpected error occurred during signup.' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user
        const user = await userModel.findOne({ username });
        if (!user) {
            console.log('User not found.');
            return res.json({ success: false, message: 'User not found.' });
        }

        // Compare passwords
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            console.log('Invalid password.');
            return res.json({ success: false, message: 'Invalid password.' });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { username: user.username, _id: user._id, role: user.role }, // Include role
            process.env.SECRET_KEY,
            { expiresIn: '12h' }
        );

        console.log('Logged-in');
        return res.json({
            success: true,
            message: 'Login successful!',
            token: jwtToken,
            username: user.username,
            role: user.role,
            cart: user.cart,
        });
    } catch (error) {
        console.log('An error occurred: ' + error);
        return res.json({ success: false, message: 'An unexpected error occurred during login.' });
    }
};


// Export both functions
module.exports = { signup, login };
