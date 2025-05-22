const { DataTypes } = require('sequelize');
const User = require('./User')

module.exports = (sequelize) => {
    const Community = sequelize.define('Community', {
        community_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        privacy: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        photo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        members_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        theme: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    }, {
        tableName: 'communities',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    });

    Community.associate = (models) => {
        Community.belongsTo(models.User, {
            foreignKey: 'owner_id',
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
        Community.belongsToMany(models.User, {
            through: models.UserCommunity,
            foreignKey: 'community_id',
            otherKey: 'user_id'
        });
    };

    return Community;
};




