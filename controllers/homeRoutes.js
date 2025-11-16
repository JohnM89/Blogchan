const express = require('express');
const router = express.Router();
const { BlogPost, Comment, User } = require('../models/index.js');
const withAuth = require('../utils/auth');

// route to render the home page
router.get('/', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: Comment,
          include: [{ model: User, attributes: ['username'] }]
        },
        {
          model: User,
          attributes: ['username']
        },
      ]
    });
    console.log("Fetched Blog Posts:", blogPostData);

    const posts = blogPostData.map(post => post.get({ plain: true }));
    console.log("Mapped Posts for Rendering:", posts);

    res.render('landingpage', {
      posts,
      loggedIn: req.session.loggedIn,
      pageTitle: 'Home - BlogChan',
      customCss: '/css/landingpage.css',
      javascripts: '/js/script.js'
    });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//route to render the blog-home page
router.get('/homepage', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: Comment,
          include: [{ model: User, attributes: ['username'] }]
        },
        {
          model: User,
          attributes: ['username']
        },
      ]
    });

    const posts = blogPostData.map(post => post.get({ plain: true }));

    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
      pageTitle: 'Home - BlogChan',
      javascripts: '/js/script.js'
    });
  } catch (err) {
    console.error('Error rendering home page:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// route to render the page for creating a new blog post
router.get('/blogs/new', withAuth, (req, res) => {
  try {
    console.log("Rendering New Post Page:", req.session.loggedIn);
    res.render('blogpost', {
      loggedIn: req.session.loggedIn,
      pageTitle: 'Create New Post - BlogChan',
      javascripts: '/js/script.js'
    });
  } catch (err) {
    console.error('Error rendering new post page:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/blogs', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: Comment,
          include: [{
            model: User,
            attributes: ['username'] 
          }]
        },
        {
          model: User,
          attributes: ['username'] 
        },
      ],
      order: [
        ['createdAt', 'DESC']
      ]
    });

    const posts = blogPostData.map(post => post.get({ plain: true }));

    
    res.render('blogs', {
      posts,
      loggedIn: req.session.loggedIn,
      pageTitle: 'All Blog Posts - BlogChan',
      javascripts: '/js/script.js'
    });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ message: 'Internal server error fetching blog posts' });
  }
});

router.get('/blogs/edit/:id', withAuth, async (req, res) => {
  try {
    const postData = await BlogPost.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username'] }],
    });

    if (!postData) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (postData.authorId !== req.session.user_id) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const post = postData.get({ plain: true });

    res.render('editblogpost', {
      post,
      loggedIn: req.session.loggedIn,
      pageTitle: 'Edit Post - BlogChan',
      javascripts: '/js/script.js',
    });
  } catch (err) {
    console.error('Error fetching blog post for edit:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      include: [{
        model: Comment,
        attributes: ['id', 'commentText', 'dateCreated', 'authorId', 'upVotes', 'downVotes'],
        include: [{
          model: User,
          attributes: ['id', 'username']
        }]
      }]
    });

    console.log("Fetched Blog Post Data:", blogPostData);

    if (!blogPostData) {
      console.log("No Blog Post Found:", req.params.id);
      return res.status(404).json({ message: 'Post not found' });
    }

    
    const post = blogPostData.get({ plain: true });


     if (req.accepts('json')) {
      res.json({ post: post });
    } else {
      res.json({ post: post });
    }
  } catch (err) {
    console.error('Error fetching blog post:', err);
    res.status(500).json({ message: 'Server error' });
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
    javascripts: '/js/script.js'
  });
});

// route to render the sign-in page
router.get('/signin', (req, res) => {
  if (req.session.loggedIn) {
    console.log("Redirecting Logged In User from Signin to Home");
    res.redirect('/');
    return;
  }

  console.log("Rendering Signin Page");
  res.render('signin', {
    pageTitle: 'Sign In - BlogChan',
    javascripts: '/js/script.js'
  });
});


module.exports = router;
