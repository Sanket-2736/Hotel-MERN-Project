const {addToCart, removeFromCart, getCart} = require('../controllers/cartcontrollers')
const authMiddleware = require('../middleware/authMiddleware')
const express = require('express')
const router = express.Router();

router.get('/get-cart', authMiddleware, getCart);
router.post('/add-to-cart', authMiddleware, addToCart);
router.post('/remove-from-cart', authMiddleware, removeFromCart);

module.exports = router;