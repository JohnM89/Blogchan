const sequelize = require('../config/connection');
const User = require('../models/User');
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

const userData = require('./user-seeds');
const blogPostData = require('./blogPost-seeds');
const commentData = require('./comment-seeds');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });

        await User.bulkCreate(userData, {
            individualHooks: true,
            returning: true,
        });

        await BlogPost.bulkCreate(blogPostData, {
            individualHooks: true,
            returning: true,
        });

        await Comment.bulkCreate(commentData, {
            individualHooks: true,
            returning: true,
        });

        console.log('Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

console.log(seedDatabase);

module.exports = { seedDatabase };
