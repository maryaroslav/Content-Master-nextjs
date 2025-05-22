const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
    const Post = sequelize.define('Post', {
        post_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image_url: {
            type: DataTypes.TEXT,  // было STRING(255)
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('image_url');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('image_url', JSON.stringify(value));
            }
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'posts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, {
            foreignKey: 'author_id',
            as: 'author'
        });
    };

    return Post;
};