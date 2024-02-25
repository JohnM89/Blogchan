console.log("Executing blogRoutes.js");

const router = require('express').Router();
const { BlogPost } = require('../../models');

console.log("Required express and models");

router.get('/', async (req, res) => {
    try {
        const blogPostsData = await BlogPost.findAll();
        const blogPosts = blogPostsData.map((post) => post.get({ plain: true }));
        res.render('homepage', { blogPosts, loggedIn: req.session.logged_in });
    } catch (err) {
        res.status(500).json(err);
    }
});

// need to add additional routes for handling updating and deleting comments etc

module.exports = router;
