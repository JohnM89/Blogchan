const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model { }

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    commentText: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateCreated: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    upVotes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },

    downVotes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    //       userId: {
    //     type: DataTypes.INTEGER, 
    //     allowNull: false
    //   },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'User',
            key: 'id',
        },

        // authorUsername: {
        //     type: DataTypes.STRING,
        //     allowNull: true,
        //     references: {
        //         model: 'user',
        //         key: 'username',

        //     },    

        // },
        blogPostId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'blogPost',
                key: 'id',
            },
        },
    },
}, {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
});

Comment.associate = (models) => {
    Comment.belongsTo(models.BlogPost, {
        foreignKey: 'blogPostId',
    });
    Comment.belongsTo(models.User, {
        foreignKey: 'authorId',
        
    });




    // Comment.belongsTo(models.User, {
    //     foreignKey: 'authorUsername',

    // });

};

module.exports = Comment;
