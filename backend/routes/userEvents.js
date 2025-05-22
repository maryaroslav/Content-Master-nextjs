const express = require('express');
const authToken = require('../middlewares/authToken');
const { UserEvent, Event } = require('../models');

const router = express.Router();

router.get('/userevents', authToken, async (req, res) => {
    try{ 
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userId = req.user.user_id;

        const userEvents = await UserEvent.findAll({
            where: { user_id: userId },
            include: {
                model: Event,
                attributes: ['event_id', 'title', 'image', 'created_at', 'members_count']
            }
        });

        const events = userEvents.map((uc) => uc.Event);
        res.json(events);
    } catch (err) {
        console.error('Error loading events: ', err);
        res.status(500).json({ message: 'Sever error', err: err.message });
    }
});

module.exports = router;