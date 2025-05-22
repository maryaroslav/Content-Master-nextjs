// models/Follow.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Follow = sequelize.define('Follow', {
    follow_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    following_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creatred_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'follows',
    timestamps: false
  });

  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
      foreignKey: 'follower_id',
      as: 'Follower',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Follow.belongsTo(models.User, {
      foreignKey: 'following_id',
      as: 'Following',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Follow;
};
