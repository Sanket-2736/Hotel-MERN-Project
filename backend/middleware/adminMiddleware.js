const adminMiddleware = (req, res, next) => {
    const role = req.body;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only!' });
    }
    next();
};

module.exports = adminMiddleware;
