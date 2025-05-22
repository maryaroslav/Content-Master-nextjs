const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const authToken = require('../middlewares/authToken');
const { User } = require('../models');

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;

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

        if (user.twoFactorEnabled) {
            return res.status(200).json({
                message: '2FA required',
                twofaRequired: true,
                userId: user.user_id
            });
        }

        const token = jwt.sign({ user_id: user.user_id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error logging in', err })
    }
});

router.post('/2fa/verify-login', async (req, res) => {
    try {
        const { userId, token } = req.body;
        const user = await User.findByPk(userId);

        if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
            return res.status(400).json({ message: '2FA not enabled for user' })
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 1
        });

        if (!verified) {
            return res.status(401).json({ message: 'Invalid 2FA token' });
        }

        const jwtToken = jwt.sign({ user_id: user.user_id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: '2FA verified', token: jwtToken, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error verifying 2FA token: ', err })
    }
});

router.post('/2fa/setup', authToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const secret = speakeasy.generateSecret({
            name: `Content-Master (${user.email})`
        });

        await user.update({ twoFactorSecret: secret.base32 });

        const qrCode = await qrcode.toDataURL(secret.otpauth_url);
        res.json({ qrCode });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating 2FA secret', err });
    }
});

router.post('/2fa/disable', authToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user_id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.update({
            twoFactorEnabled: false,
            twoFactorSecret: null
        });

        res.json({ message: '2FA disabled successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error disabling 2FA', err });
    }
});

router.post('/2fa/verify', authToken, async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findByPk(req.user.user_id);

        if (!user || !user.twoFactorSecret) {
            return res.status(400).json({ message: 'User or secret not found' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 1
        });

        if (verified) {
            await user.update({ twoFactorEnabled: true });

            const newToken = jwt.sign(
                { user_id: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.json({ verified: true, token: newToken });
        }
        res.json({ verified });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error verifying 2FA token', err });
    }
});

module.exports = router;