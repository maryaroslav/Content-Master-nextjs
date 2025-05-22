const { Server } = require('socket.io');
const socketAuthMiddleware = require('./middlewares/socketAuthMiddleware');
const privateMessagesHandler = require('./handlers/privateMessages');

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            credentials: true
        }
    });

    io.use(socketAuthMiddleware);

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.user.user_id}`);
        privateMessagesHandler(io, socket);
    });
}

module.exports = initializeSocket;