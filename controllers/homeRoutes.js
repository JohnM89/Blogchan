const express = require('express');
const router = express.Router();
const { BlogPost, Comment, User } = require('../models/index.js');

// Route to render the home page
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

// Route to render the page for creating a new blog post
router.get('/blogs/new', (req, res) => {
  try {
    res.render('blogpost', {
      loggedIn: req.session.loggedIn,
      pageTitle: 'Create New Post - BlogChan',
      stylesheets: '/css/style.css',
      javascripts: '/js/script.js'
    });
  } catch (err) {
    console.error('Error rendering new post page:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to view a specific blog post
router.get('/blogs/:id', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      include: [{ model: Comment, attributes: ['id', 'commentText', 'dateCreated', 'authorId', 'upVotes', 'downVotes'] }],
    });

    if (!blogPostData) {
      return res.status(404).send('Post not found');
    }

    res.render('blogpost', {
      post: blogPostData.get({ plain: true }),
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.error('Error fetching blog post:', err);
    res.status(500).send('Server error');
  }
});

// Route to handle sign-up form submission
router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to handle sign-in form submission
router.post('/signin', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData || !await userData.checkPassword(req.body.password)) {
      return res.status(400).json({ message: 'Incorrect email or password, please try again' });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to render the sign-up page
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup', {
    pageTitle: 'Sign Up - BlogChan',
    stylesheet: '/css/style.css',
    javascript: '/js/script.js'
  });
});

// Route to render the sign-in page
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
