const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    available: { type: Boolean, default: true }
});

const foodModel = mongoose.model('Food', foodSchema);
module.exports = foodModel;
