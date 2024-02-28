const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class BlogPost extends Model { }

BlogPost.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    upVotes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    downVotes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
authorId: {
    type: DataTypes.INTEGER,
    references: {
        model: 'User', // Use the correct model name
        key: 'id', // Use the correct column name
    },
},
}, {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'blogPost',
});

BlogPost.associate = (models) => {
    BlogPost.hasMany(models.Comment, {
        foreignKey: 'blogPostId',
    });
};

module.exports = BlogPost;
