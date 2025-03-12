const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserCommunity = sequelize.define('UserCommunity', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        community_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    }, {
        tableName: 'users_communities',
        timestamps: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    });

    UserCommunity.associate = (models) => {
        UserCommunity.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        UserCommunity.belongsTo(models.Community, {
            foreignKey: 'community_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return UserCommunity;
};