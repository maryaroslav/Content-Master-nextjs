const express = require('express');
const multer = require('multer');
const path = require('path');
const authToken = require('../middlewares/authToken');
const { User, Follow, Message } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/chat_images'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/following', authToken, async (req, res) => {
    try {
        const currentUserId = req.user.user_id;

        const follows = await Follow.findAll({
            where: { follower_id: currentUserId },
            include: [
                {
                    model: User,
                    as: 'Following',
                    attributes: ['user_id', 'username', 'profile_picture'],
                    include: [
                        {
                            model: Message,
                            as: 'SentMessages',
                            where: { to_user_id: currentUserId },
                            required: false,
                            attributes: ['updated_at'],
                            limit: 1,
                            order: [['updated_at', 'DESC']]
                        },
                        {
                            model: Message,
                            as: 'ReceivedMessages',
                            where: { from_user_id: currentUserId },
                            required: false,
                            attributes: ['updated_at'],
                            limit: 1,
                            order: [['updated_at', 'DESC']]
                        }
                    ]
                }
            ]
        });

        const followedUsers = follows.map(f => {
            const u = f.Following;
            const sent = u.SentMessages?.[0]?.updated_at;
            const received = u.ReceivedMessages?.[0]?.updated_at;
            const last = [sent, received].filter(Boolean).sort((a, b) => new Date(b) - new Date(a))[0];

            return {
                user_id: u.user_id,
                username: u.username,
                profile_picture: u.profile_picture,
                last_message_time: last || null
            };
        });

        followedUsers.sort((a, b) => new Date(b.last_message_time || 0) - new Date(a.last_message_time || 0));
        res.json(followedUsers);
    } catch (err) {
        console.error('[chat/following] Error: ', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/message/:userId', authToken, async (req, res) => {
    const fromId = req.user.user_id;
    const toId = parseInt(req.params.userId);

    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { from_user_id: fromId, to_user_id: toId },
                    { from_user_id: toId, to_user_id: fromId }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'FromUser',
                    attributes: ['user_id', 'username', 'profile_picture']
                }
            ],
            order: [['created_at', 'ASC']]
        });

        res.json(messages)
    } catch (err) {
        console.error('[chat/message] Error: ', err);
        res.status(500).json({ message: 'Failed to load messages' });
    }
});

router.post('/upload', authToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({ url: `/uploads/chat_images/${req.file.filename}` });
});

module.exports = router;