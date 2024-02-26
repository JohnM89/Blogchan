const express = require('express');
const router = express.Router();
const { BlogPost } = require('../models');
const withAuth = require('../utils/auth.js');

router.get('/', async (req, res) => {
    try {
        const blogPostData = await BlogPost.findAll();
        const posts = blogPostData.map(post => post.get({ plain: true }));

        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn, 
            pageTitle: 'Home - BlogChan',
            stylesheets: '/css/style.css', 
            javascripts: '/js/script.js'
        });
    } catch (err) {
        console.error('Error fetching blog posts:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/signin', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signin', {
        pageTitle: 'Sign In - BlogChan',
        stylesheets: '/css/style.css', 
        javascripts: '/js/script.js'
    });
});


module.exports = router;
