const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const db = require('../models');
const { User, Community } = db;
const authToken = require('../middlewares/authToken');

router.get('/search', authToken, async (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    const userId = req.user.user_id;

    try {
        const users = await User.findAll({
            where: {
                username: {
                    [Op.like]: `%${query}%`
                },
                user_id: { [Op.ne]: userId }
            },
            attributes: ['user_id', 'username', 'bio', 'profile_picture']
        });

        const communities = await Community.findAll({
            where: {
                name: {
                    [Op.like]: `%${query}%`
                },
                owner_id: { [Op.ne]: userId }
            },
            attributes: ['community_id', 'name', 'privacy', 'photo', 'members_count']
        });

        res.json({ users, communities });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Search error' });
    }
});

module.exports = router;
