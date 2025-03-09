const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Ensure this contains the `role` property
        next();
    } catch (error) {
        console.log(error);        
        res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
