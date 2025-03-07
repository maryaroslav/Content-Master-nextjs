const express = require('express');
const cors = require('cors');
const bodyParse = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParse.json());

app.use('/api/auth', authRoutes);

app.listen(5000, () => {
    console.log('Server running');
})