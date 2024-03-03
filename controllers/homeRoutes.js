const express = require('express');
const router = express.Router();
const { BlogPost, Comment, User } = require('../models/index.js');
const withAuth = require('../utils/auth');

// Route to render the home page
router.get('/', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
  include: [{ model: Comment }]
});
    console.log("Fetched Blog Posts:", blogPostData);
    
    const posts = blogPostData.map(post => post.get({ plain: true }));
    console.log("Mapped Posts for Rendering:", posts);

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
    console.log("Rendering New Post Page:", req.session.logged_in);
    res.render('blogpost', {
      loggedIn: req.session.logged_in || true,
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
    console.log("Fetched Blog Post Data:", blogPostData);

    if (!blogPostData) {
      console.log("No Blog Post Found:", req.params.id);
      return res.status(404).send('Post not found');
    }

    res.render('blogpost', {
      loggedIn: req.session.logged_in || true,
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
    console.log("User Signed Up:", userData);
    
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      res.redirect('/');
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(400).json(err);
  }
});

// Route to handle blog post form submission
router.post('/blogs', async (req, res) => {
  try {
    const newBlogPost = await BlogPost.create({
      ...req.body,
      userId: req.session.userId,
    });
    console.log("New Blog Post Added:", newBlogPost);

    // res.status(200).json(newBlogPost);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding new blog post:', err);
    res.status(400).json(err);
  }
});

// Route to handle comment form submission
router.post('/comment', async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      userId: req.session.userId,
    });
    console.log("New Comment Added:", newComment);

    // res.status(200).json(newComment);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding new comment:', err);
    res.status(400).json(err);
  }
});



// Route to handle sign-in form submission
router.post('/signin', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    console.log("User Signing In:", userData);

    if (!userData || !await userData.checkPassword(req.body.password)) {
      console.log("Sign-in Failed: Invalid credentials");
      return res.redirect('/signin?error=loginFailed');
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      console.log("User Logged In:", req.session.user_id);
      res.redirect('/');
    });
  } catch (err) {
    console.error('Sign-in Error:', err);
    res.status(400).json(err);
  }
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    console.log("Redirecting Logged In User from Signup to Home");
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.redirect('/');
    return;
  }

  console.log("Rendering Signup Page");
  res.render('signup', {
    pageTitle: 'Sign Up - BlogChan',
    stylesheet: '/css/style.css',
    javascript: '/js/script.js'
  });
});


// Route to render the sign-in page
router.get('/signin', (req, res) => {
  if (req.session.loggedIn) {
    console.log("Redirecting Logged In User from Signin to Home");
    res.redirect('/');
    return;
  }

  console.log("Rendering Signin Page");
  res.render('signin', {
    pageTitle: 'Sign In - BlogChan',
    stylesheets: '/css/style.css',
    javascripts: '/js/script.js'
  });
});

module.exports = router;
