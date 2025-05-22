const express = require('express');
const authToken = require('../middlewares/authToken');
const { Follow } = require('../models')

const router = express.Router();

router.post('/follow/:userId', authToken, async (req, res) => {
    try {
        const [follow, created] = await Follow.findOrCreate({
            where: {
                follower_id: req.user.user_id,
                following_id: req.params.userId
            }
        })
        res.json({ success: true, created })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
});

router.post('/unfollow/:userId', authToken, async (req, res) => {
    try {
        const result = await Follow.destroy({
            where: {
                follower_id: req.user.user_id,
                following_id: req.params.userId
            }
        })
        res.json({ success: true, removed: result > 0 })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
});

router.get('/status/:userId', authToken, async (req, res) => {
    try {
        const isFollowing = await Follow.findOne({
            where: {
                follower_id: req.user.user_id,
                following_id: req.params.userId
            }
        })
        res.json({ isFollowing: !!isFollowing })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
});

module.exports = router;