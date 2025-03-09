const jwt = require('jsonwebtoken');
const foodModel = require('../models/foodModel');
const userModel = require('../models/userModel');

const addToCart = async (req, res) => {
    const { itemName, quantity } = req.body;
    const authHeader = req.headers['authorization']; // Updated to read the Authorization header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1]; // Extracting the token

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const item = await foodModel.findOne({ itemName });
        if (!item) {
            return res.status(404).json({ success: false, message: `Item not found!` });
        }

        const existingItem = user.cart.find(cartItem => cartItem.itemName === itemName);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ itemName, quantity });
        }

        await user.save();
        return res.status(200).json({ success: true, message: `Item added to cart successfully!` });
    } catch (error) {
        console.error("Error occurred while adding item to cart:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const removeFromCart = async (req, res) => {
    const { itemName } = req.body;
    const authHeader = req.headers['authorization']; // Updated to read the Authorization header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1]; // Extracting the token

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.cart = user.cart.filter(cartItem => cartItem.itemName !== itemName);
        await user.save();

        return res.status(200).json({ success: true, message: `${itemName} removed from cart successfully!` });
    } catch (error) {
        console.error("Error occurred while removing item from cart:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get User's Cart
const getCart = async (req, res) => {
    const authHeader = req.headers['authorization']; // Updated to read the Authorization header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1]; // Extracting the token

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, cart: user.cart, message: 'Cart retrieved successfully!' });
    } catch (error) {
        console.error("Error occurred while fetching cart:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getCart
};
