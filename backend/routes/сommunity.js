const express = require('express');
const multer = require('multer');
const path = require('path');
const authToken = require('../middlewares/authToken');
const { Community } = require('../models');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/communities_images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/createcommunity', authToken, upload.single('photo'),async (req, res) => {
    try {
        const { name, privacy, theme, description } = req.body;
        const photo = req.file;
        const owner_id = req.user.user_id;
    
        if (!name || !privacy || !theme || !photo) {
           return res.status(400).json({ message: 'Title, type and image are required' })
        }
    
        const newCommunity = await Community.create({
            name,
            privacy,
            theme,
            description,
            photo: photo.filename,
            owner_id
        });
        res.status(201).json({ message: 'Community created successfully', community: newCommunity })
    } catch (err) {
        console.error('Error creating community: ', err);
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
});

router.get('/mycommunities', authToken, async (req, res) => {
    try {
        const owner_id = req.user.user_id;
        const communities = await Community.findAll({
            where: {owner_id}
        });

        res.json(communities);
    } catch {
        console.error('Error fetching communities: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;