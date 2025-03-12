const express = require('express');
const cors = require('cors');
const bodyParse = require('body-parser');
const authRoutes = require('./routes/auth');
const db = require('./models');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

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
