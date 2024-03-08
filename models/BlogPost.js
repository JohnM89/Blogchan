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
    date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
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
            model: 'User', 
            key: 'id',
        },
    },
}, {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'BlogPost',
});

BlogPost.associate = (models) => {
    BlogPost.hasMany(models.Comment, {
        foreignKey: 'blogPostId',
    });
    BlogPost.belongsTo(models.User, {
        foreignKey: 'authorId',
         constraint: 'fk_author_id',
    });
};

module.exports = BlogPost;