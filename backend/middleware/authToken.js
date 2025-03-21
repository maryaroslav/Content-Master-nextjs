const jwt = require("jsonwebtoken");


function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token error: ', error.message);
        return res.status(403).json({ message: 'Forbidden: Invalid token', error: error.message });
    }
}

module.exports = authMiddleware;
