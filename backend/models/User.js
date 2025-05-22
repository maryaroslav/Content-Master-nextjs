const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },
        profile_picture: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        role: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'user'
        },
        twoFactorEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        twoFactorSecret: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci',
    });

    User.associate = (models) => {
        User.hasMany(models.Community, {
            foreignKey: 'owner_id'
        });
        User.belongsToMany(models.Community, {
            through: models.UserCommunity,
            foreignKey: 'user_id',
            otherKey: 'community_id'
        });
        User.hasMany(models.Message, {
            foreignKey: 'from_user_id',
            as: 'SentMessages'
        });

        User.hasMany(models.Message, {
            foreignKey: 'to_user_id',
            as: 'ReceivedMessages'
        });

    };

    return User;
};

