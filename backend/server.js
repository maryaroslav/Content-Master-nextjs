require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const path = require('path');

const db = require('./models');

const app = express();

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

app.use('/uploads', express.static('uploads'));

const startServer = async () => {
    try {
        await db.sequelize.sync();
        console.log('database connected');

        app.listen(5000, () => {
            console.log('Server running');
        });
    } catch (err) {
        console.error(err);
    }
};

startServer();
