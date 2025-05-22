require('dotenv').config();

const express = require('express');
const cors = require('cors');
const initializeSocket = require('./sockets');
const http = require('http');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const createCommunityRoutes = require('./routes/сommunity');
const chatRoutes = require('./routes/chat');
const postRoutes = require('./routes/posts');
const followRoutes = require('./routes/follow');
const searchRoutes = require('./routes/search');

const db = require('./models');

const app = express();
console.log('[BACKEND] JWT_SECRET:', process.env.JWT_SECRET);

const server = http.createServer(app);
initializeSocket(server);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', createCommunityRoutes)
app.use('/api', searchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follow', followRoutes);

app.use('/uploads', express.static('uploads'));

const startServer = async () => {
    try {
        await db.sequelize.sync();
        console.log('database connected');

        server.listen(5000, () => {
            console.log('Server running');
        });
    } catch (err) {
        console.error(err);
    }
};

startServer();
