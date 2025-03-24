const express = require('express');
const authToken = require('../middleware/authToken');
const { UserCommunity, Community } = require('../models');

const router = express.Router();

router.get('/usercommunities', authToken, async(req, res) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user.user_id;
        console.log('User ID:', userId);

        const userCommunities = await UserCommunity.findAll({
            where: {user_id: userId},
            include: {
                model: Community,
                attributes: ['community_id', 'title', 'type', 'image', 'members_count']
            }
        });

        if (!userCommunities || userCommunities.length === 0) {
            console.log("No communities found for user:", userId);
        } else {
            console.log("Communities found:", userCommunities.length);
        }

        const communities = userCommunities.map((uc) => uc.Community);
        res.json(communities);
    } catch (err) {
        console.error('Error loading communitites: ', err);
        res.status(500).json({ message: 'Server error', err: err.message });
    }
})

module.exports = router;