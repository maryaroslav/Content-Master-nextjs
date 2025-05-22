const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Message = sequelize.define('Message', {
        message_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        from_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        to_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        media_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('text', 'image'),
            allowNull: false,
            defaultValue: 'text'
        }
    }, {
        tableName: 'messages',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci',
    });
    Message.associate = (models) => {
        Message.belongsTo(models.User, {
            foreignKey: 'from_user_id',
            as: 'FromUser',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        Message.belongsTo(models.User, {
            foreignKey: 'to_user_id',
            as: 'ToUser',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }
    return Message;
}