const express = require('express');
const router = express.Router();
const authToken = require('../middlewares/authToken');
const upload = require('../middlewares/uploadPostImage');
const { Post, User } = require('../models');

router.post('/', authToken, upload.array('images', 5), async (req, res) => {
    const { title, content } = req.body;

    try {
        const imagePaths = req.files.map(file => `/uploads/user_posts/${file.filename}`);

        const newPost = await Post.create({
            title,
            content,
            image_url: imagePaths,
            author_id: req.user.user_id
        });

        res.status(201).json(newPost);
    } catch (err) {
        console.error('[post error]', err);
        res.status(500).json({ message: 'Error creating a post', error: err.message });
    }
});

router.get('/', authToken, async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                as: 'author',
                attributes: ['username', 'profile_picture'],
            }],
            order: [['created_at', 'DESC']]
        });
        res.json(posts);
    } catch (err) {
        console.error('[get posts error]', err);
        res.status(500).json({ message: 'Error in getting posts', error: err.message });
    }
});

router.delete('/:id', authToken, async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author_id !== req.user.user_id) {
            return res.status(403).json({ message: 'You are not allowed to delete this post.' });
        }

        await post.destroy();
        res.status(200).json({ message: 'Post deleted' });
    } catch (err) {
        console.error('[delete post error]', err);
        res.status(500).json({ message: 'Error deleting post', error: err.message });
    }
});

module.exports = router;