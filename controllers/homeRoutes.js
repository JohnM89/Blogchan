const express = require('express');
const router = express.Router();
const { BlogPost } = require('../models');
const withAuth = require('../utils/auth.js');

router.get('/', async (req, res) => {
    try {
        const blogPostData = await BlogPost.findAll();
        const posts = blogPostData.map(post => post.get({ plain: true }));
        res.render('homepage', { posts });
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

  res.render('signin');
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userBlogPosts = await BlogPost.findAll({
      where: {
        userId: req.session.userId
      }
    });
    const posts = userBlogPosts.map(post => post.get({ plain: true }));

    res.render('dashboard', {
      posts,
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    console.error('Error fetching user blog posts:', err);
    res.redirect('/login');
  }
});

module.exports = router;

