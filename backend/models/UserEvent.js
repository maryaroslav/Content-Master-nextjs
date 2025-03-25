const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserEvent = sequelize.define('UserEvent', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        event_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    }, {
        tableName: 'users_events',
        timestamps: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    });

    UserEvent.associate = (models) => {
        UserEvent.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        UserEvent.belongsTo(models.Event, {
            foreignKey: 'event_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return UserEvent;
}