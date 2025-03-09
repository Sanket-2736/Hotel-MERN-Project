const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const cors = require('cors');
const authroute = require('./routes/authroute.js');
const foodroute = require('./routes/foodRoute.js')
const cartroute = require('./routes/cartroute.js')
const connectDB = require('./config/db.js');

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authroute);
app.use('/food', foodroute);
app.use('/cart', cartroute);

connectDB().then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
        console.log(`Server started at http://localhost:${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("Error in connecting to MongoDB: " + err);
});