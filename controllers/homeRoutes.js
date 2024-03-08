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



// route to render the page for creating a new blog post
router.get('/blogs/new', (req, res) => {
  try {
    console.log("Rendering New Post Page:", req.session.logged_in);
    res.render('blogpost', {
      loggedIn: req.session.logged_in || true,
      pageTitle: 'Create New Post - BlogChan',
      stylesheets: 'public/css/style.css',
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
            attributes: ['username'] // Assuming you want to show the username of the commenters
          }]
        },
        {
          model: User,
          attributes: ['username'] // Assuming this is the author of the blog post
        },
      ],
      order: [
        ['createdAt', 'DESC'] // Assuming you want to order the posts by their creation time in descending order
      ]
    });

    // Convert the Sequelize data into a format that can be easily rendered by the view
    const posts = blogPostData.map(post => post.get({ plain: true }));

    // Render the 'blogs' view, passing in the blog post data
    res.render('blogs', { // Assuming you have a 'blogs.handlebars' view file set up to display the list of posts
      posts,
      loggedIn: req.session.loggedIn, // Pass session data to view, to adjust UI based on login status
      pageTitle: 'All Blog Posts - BlogChan',
      stylesheets: '/css/style.css',
      javascripts: '/js/script.js'
    });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ message: 'Internal server error while fetching blog posts' });
  }
});

router.get('/blogs/edit/:id', async (req, res) => {
  try {
    const postData = await BlogPost.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username'] }],
    });

    if (!postData) {
      return res.status(404).send('Post not found');
    }

    // Optional: Check if the logged-in user is the author of the blog post
    // You can add this check if you store the authorId in the BlogPost model and user_id in the session
    if (postData.authorId !== req.session.user_id) {
      return res.status(403).send('Not authorized to edit this post please log in');
    }

    // Convert Sequelize model instance into a plain object for easy handling in the template
    const post = postData.get({ plain: true });

    res.render('editblogpost', { // Make sure you have an 'editpost.handlebars' file in your views
      post,
      loggedIn: req.session.logged_in || true, // Ensure loggedIn is correctly tracked in your session
      pageTitle: 'Edit Post - BlogChan',
      stylesheets: '/css/style.css',
      javascripts: '/js/script.js',
    });
  } catch (err) {
    console.error('Error fetching blog post for edit:', err);
    res.status(500).send('Server error');
  }
});
// router.get('/blogs/edit/:id', withAuth, async (req, res) => {
//   // Adjusted code from '/blogs/new/:id?' for clarity and to prevent conflict...
//   let postData = null;
//   if (req.params.id) {
//     // Edit mode
//     postData = await BlogPost.findByPk(req.params.id, {
//       include: [
//         { model: User, attributes: ['username'] },
//       ],
//     });
//     if (postData) {
//       postData = postData.get({ plain: true });
//     }
//   }


//   res.render('editpost', { // Assuming you have an 'editpost' view
//     postData,
//     loggedIn: req.session.logged_in || true,
//     pageTitle: 'Edit Post - BlogChan',
//     stylesheets: '/css/style.css',
//     javascripts: '/js/script.js',
//   });
// });

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
      // For an API client, this will return JSON indicating the post was not found.
      return res.status(404).json({ message: 'Post not found' });
    }

    // Convert Sequelize model instance into a plain object.
    const post = blogPostData.get({ plain: true });

    // Check if the request accepts JSON.
    // This is a simple way to distinguish between API clients and web browsers.
    // if (req.accepts('html')) {
    //   res.render('blogpost', {
    //     loggedIn: req.session.logged_in || true, // Make sure this variable is correctly set
    //     post: post,
    //   });
     if (req.accepts('json')) {
      // Respond with JSON if the client prefers JSON.
      res.json({ post: post });
    } else {
      // Default to sending JSON if no preference is detected.
      res.json({ post: post });
    }
  } catch (err) {
    console.error('Error fetching blog post:', err);
    // Providing JSON response on server error as well, for consistency with API clients.
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/blogs/:id', async (req, res) => {
  try {
    const { title, content } = req.body; // Assuming these are the fields you wish to update

    // Perform the update operation
    const updateResult = await BlogPost.update({ title, content }, {
      where: {
        id: req.params.id,
        // Include authorId check if appropriate for your application's security
        authorId: req.session.user_id,
      },
    });

    // Check if the update operation was successful
    if (updateResult[0] > 0) {
      res.redirect('/'); // Or to another appropriate route
    } else {
      res.status(404).send('Post not found or not authorized to edit');
    }
  } catch (err) {
    console.error('Error updating blog post:', err);
    res.status(500).send('Server error');
  }
});


module.exports = router;


router.delete('/blogs/delete/:id', withAuth, async (req, res) => {
  try {
    // Logic to delete the blog post
    const deleted = await BlogPost.destroy({
      where: {
        id: req.params.id,
        authorId: req.session.user_id,
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    if (deleted) {
      res.redirect('/');
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    console.error('Error deleting blog post:', err);
    res.status(500).send('Server error');
  }
});


// Route to edit a blog post
// router.get('/blogs/new/:id?', async (req, res) => {
//   let postData = null;
//   if (req.params.id) {
//     // Edit mode
//     postData = await BlogPost.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           attributes: ['username'],
//         },
//       ],
//     });
//     if (postData) {
//       postData = postData.get({ plain: true });
//     }
//   }



//   res.render('blogpost', {
//     postData, // Pass post data for editing
//     loggedIn: req.session.logged_in || true,
//     pageTitle: postData ? `Edit Post - BlogChan` : `Create New Post - BlogChan`,
//     stylesheets: '/css/style.css',
//     javascripts: '/js/script.js',
//   });
// });




// route to handle sign-up form submission
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

// route to handle blog post form submission
router.post('/blogs', async (req, res) => {
  try {
    const newBlogPost = await BlogPost.create({
      ...req.body,
      authorId: req.session.user_id,

    });
    console.log("New Blog Post Added:", newBlogPost);

    // res.status(200).json(newBlogPost);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding new blog post:', err);
    res.status(400).json(err);
  }
});

// route to handle comment form submission
router.post('/comment', async (req, res) => {

  if (!req.session.loggedIn) {
    console.log("User not logged in");
    return res.status(401).send('You need to be logged in to comment');
  }
  try {
    const newComment = await Comment.create({
      ...req.body,
      authorId: req.session.user_id,
    });
    console.log("New Comment Added:", newComment);

    // res.status(200).json(newComment);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding new comment:', err);
    res.status(400).json(err);
  }
});

// route to handle upVote button click
router.put('/upvote/:id', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id);
    if (!blogPostData) {
      console.log("No Blog Post Found:", req.params.id);
      return res.status(404).send('Post not found');

    }

    blogPostData.upVotes++;
    await blogPostData.save();
    console.log("Blog Post Upvoted:", blogPostData);

    // res.status(200).json(blogPostData);
    res.redirect('/');
  } catch (err) {
    console.error('Error upvoting blog post:', err);
    // res.status(500).json(err);
    res.redirect('/');
  }
});

// route to handle downVote button click
router.put('/downvote/:id', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id);
    if (!blogPostData) {
      console.log("No Blog Post Found:", req.params.id);
      return res.status(404).send('Post not found');
    }

    blogPostData.downVotes++;
    await blogPostData.save();
    console.log("Blog Post Downvoted:", blogPostData);

    // res.status(200).json(blogPostData);
    res.redirect('/');
  } catch (err) {
    console.error('Error downvoting blog post:', err);
    // res.status(500).json(err);
    res.redirect('/');
  }
});


// route to handle sign-in form submission
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
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
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
    stylesheet: './css/style.css',
    javascript: '/js/script.js'
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
    stylesheets: '/css/style.css',
    javascripts: '/js/script.js'
  });
});

// route to handle sign-out
router.post('/signout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      console.log("User Logged Out");
      res.redirect('/');
    });
  } else {
    console.log("No User to Log Out");
    res.status(404).end();
  }
});

module.exports = router;
