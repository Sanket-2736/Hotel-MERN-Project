const foodModel = require('../models/foodModel');

const getFoodById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the food item by ID
        const foodItem = await foodModel.findById(id);

        // If the item does not exist, return a 404 response
        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found!',
            });
        }

        return res.status(200).json({
            success: true,
            data: foodItem,
        });
    } catch (error) {
        console.error('Error fetching food item by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error occurred while fetching the food item.',
        });
    }
};

const addFood = async (req, res) => {
    try {
        console.log('File:', req.file);
        console.log('Body:', req.body);

        const { itemName, price, description, available } = req.body;

        // Validate required fields
        if (!itemName || !price) {
            return res.status(400).json({
                success: false,
                message: 'itemName and price are required',
            });
        }

        const item = foodModel.findOne({itemName});

        if(item){
            console.log("Item already exists in the list");
            return res.status(201).json({
                success: false,
                message: 'Item already exists in the list!',
            });
        }

        // Create a new food item
        const foodItem = new foodModel({
            itemName,
            price,
            description,
            available: available === 'true', // Convert string to boolean if needed
            imagePath: req.file ? req.file.path : null,
        });

        await foodItem.save();

        res.status(201).json({
            success: true,
            message: 'Food item added successfully!',
            data: foodItem,
        });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ success: false, message: 'Failed to add food item.' });
    }
};

const getFoodList = async (req, res) => {
    try {
        const list = await foodModel.find(); // Fetch all food items
        if (list.length === 0) {
            return res.status(404).json({ success: false, message: "No food items in the list!" });
        }
        return res.status(200).json({ success: true, list });
    } catch (error) {
        console.error("Error occurred in getting the food list:", error);
        return res.status(500).json({ success: false, message: "Error occurred in getting the food list!" });
    }
};

const updateFoodPrice = async (req, res) => {
    try {
        const { itemName, newPrice } = req.body;

        // Find the item by name
        const item = await foodModel.findOne({ name: itemName });
        if (!item) {
            console.log(`Item not found`);
            return res.status(404).json({ success: false, message: `Item not found` });
        }

        // Update the price
        item.price = newPrice;
        await item.save(); // Save updated document to database

        console.log("Price updated successfully!");
        return res.status(200).json({ success: true, message: "Price updated successfully!" });
    } catch (error) {
        console.error("Error updating food price:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    addFood,
    getFoodList,
    getFoodById,
    updateFoodPrice
};
