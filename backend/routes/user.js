const express = require('express');
const authToken = require('../middlewares/authToken');
const { User } = require('../models');

const userCommunitiesRoutes = require('./userCommunities');
const userEventsRoutes = require('./userEvents');

const router = express.Router();

router.get('/me', authToken, async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: "Unauthorized: Invalid user data" });
        }

        const user = await User.findOne({
            where: { email: req.user.email }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            bio: user.bio,
            profile_picture: user.profile_picture,
            created_at: user.created_at,
            role: user.role,
            twoFactorEnabled: user.twoFactorEnabled
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/byusername/:username', authToken, async (req, res) => {
    try {
        const user = await User.findOne({
            where: { username: req.params.username }
        })

        if (!user) return res.status(404).json({ message: 'User not found' })

        res.json({
            user_id: user.user_id,
            username: user.username,
            full_name: user.full_name,
            bio: user.bio,
            profile_picture: user.profile_picture
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
});

router.use(userCommunitiesRoutes);
router.use(userEventsRoutes);

module.exports = router;