const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware')
const { addFood, getFoodList, updateFoodPrice, getFoodById } = require('../controllers/foodcontrollers');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.post('/add-food', authMiddleware, adminMiddleware, upload.single('file'), addFood);
router.get('/get-food-list', getFoodList);
router.get('/get-food-item/:id', getFoodById);
router.post('/update-food-price', authMiddleware, adminMiddleware, updateFoodPrice);

module.exports = router;
