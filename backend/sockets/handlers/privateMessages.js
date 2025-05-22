const { Message, User } = require('../../models');

function privateMessagesHandler(io, socket) {
    socket.join(`user_${socket.user.user_id}`);

    socket.on('private_message', async ({ toUserId, message, type = 'text', media_url = null }) => {
        try {
            const newMessage = await Message.create({
                from_user_id: socket.user.user_id,
                to_user_id: toUserId,
                content: message || '',
                media_url: type === 'image' ? media_url : null,
                type
            });

            const fromUser = await User.findByPk(socket.user.user_id);

            const payload = {
                from_user_id: socket.user.user_id,
                to_user_id: toUserId,
                content: type === 'text' ? (message || '') : '',
                media_url: type === 'image' ? media_url : null,
                type,
                created_at: newMessage.created_at,
                FromUser: {
                    username: fromUser?.username || 'Undefined',
                    profile_picture: fromUser?.profile_picture || null
                }
            };
            io.to(`user_${socket.user.user_id}`).emit('private_message', payload);
            io.to(`user_${toUserId}`).emit('private_message', payload);
        } catch (err) {
            console.error('[socket.io] Feiled to save message: ', err.message);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.user.user_id} disconnect`);
    });
}

module.exports = privateMessagesHandler;