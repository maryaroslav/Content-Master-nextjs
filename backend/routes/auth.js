const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

const SECRET_KEY = process.env.NEXTAUTH_SECRET;

router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ email, password_hash: hashedPassword, username });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Error creating user', err });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error logging in', err })
    }
});

module.exports = router;