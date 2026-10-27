const jwt = require("jsonwebtoken");

// Middleware to validate JWT
const verifyToken = (req, res, next) => { 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        // Verify token using your environment variable secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user payload to request so subsequent routes can access it
        req.user = decoded;
        
        // Pass control to the next middleware or route handler
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;
