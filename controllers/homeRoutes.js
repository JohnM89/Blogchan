const express = require('express');
const router = express.Router();
const { BlogPost } = require('../models/index.js');
const withAuth = require('../utils/auth.js');
const { Comment } = require('../models/index.js');
const { User } = require('../models/index.js');

router.get('/', async (req, res) => {
  try {
    
    const blogPostData = await BlogPost.findAll();
    const posts = blogPostData.map(post => post.get({ plain: true }));

    console.log('blogPostData:', blogPostData);
    console.log('posts:', posts);
    console.log('loggedIn:', req.session.loggedIn);
    console.log('pageTitle:', 'Home - BlogChan');
    console.log('stylesheets:', '/css/style.css');
    console.log('javascripts:', '/js/script.js');

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

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  console.log('pageTitle:', 'Sign Up - BlogChan');
  console.log('stylesheets:', '/css/style.css');
  console.log('javascripts:', '/js/script.js');

  res.render('signup', {
    pageTitle: 'Sign Up - BlogChan',
    stylesheets: '/css/style.css', 
    javascripts: '/js/script.js'
  });
});



router.get('/signin', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  console.log('pageTitle:', 'Sign In - BlogChan');
  console.log('stylesheets:', '/css/style.css');
  console.log('javascripts:', '/js/script.js');

  res.render('signin', {
    pageTitle: 'Sign In - BlogChan',
    stylesheets: '/css/style.css', 
    javascripts: '/js/script.js'
  });
});

module.exports = router;
