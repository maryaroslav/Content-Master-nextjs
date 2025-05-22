const jwt = require("jsonwebtoken");

const socketAuthMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token;
    console.log('[socket.io] RAW token:', token);
    if (!token) {
        return next(new Error('No token provided'))
    }

    try {
        const pureToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const decoded = jwt.verify(pureToken, process.env.JWT_SECRET);
        console.log('[socket.io] decoded:', decoded);
        socket.user = {
            user_id: decoded.id ?? decoded.user_id,
            email: decoded.email
        };
        next();
    } catch (err) {
        console.error('[socket.io] verify error:', err.message);
        next(new Error('Invalid token'));
    }
}

module.exports = socketAuthMiddleware;