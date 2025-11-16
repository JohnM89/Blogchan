const express = require('express');
const router = express.Router();
const { BlogPost, Comment, User } = require('../../models/index.js');
const withAuth = require('../../utils/auth');


router.put('/blogs/:id', withAuth, async (req, res) => {
  try {
    const { title, content } = req.body; 

    const updateResult = await BlogPost.update({ title, content }, {
      where: {
        id: req.params.id,
        
        authorId: req.session.user_id,
      },
    });

    
    if (updateResult[0] > 0) {
      res.redirect('/homepage'); 
    } else {
      res.status(404).send('Post not found or not authorized to edit');
    }
  } catch (err) {
    console.error('Error updating blog post:', err);
    res.status(500).send('Server error');
  }
});

router.delete('/blogs/delete/:id', withAuth, async (req, res) => {
  try {
    
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
      res.render('signin', { message: 'You are not authorized to delete this post' } )
    }
  } catch (err) {
    console.error('Error deleting blog post:', err);
    res.redirect('/homepage'); 
  }
});

// route to handle sign-up form submission
router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    console.log("User Signed Up:", userData);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      res.redirect('/homepage');
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(400).json(err);
  }
});

// route to handle blog post form submission
router.post('/blogs', withAuth, async (req, res) => {
  try {
    const newBlogPost = await BlogPost.create({
      ...req.body,
      authorId: req.session.user_id,

    });
    console.log("New Blog Post Added:", newBlogPost);

    // res.status(200).json(newBlogPost);
    res.redirect('/homepage');
  } catch (err) {
    console.error('Error adding new blog post:', err);
    res.status(400).json(err);
  }
});

// route to handle comment form submission
router.post('/comment', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      authorId: req.session.user_id,
    });
    console.log("New Comment Added:", newComment);

    // res.status(200).json(newComment);
    res.redirect('/homepage');
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
      return res.status(404).json({ message: 'Post not found' });
    }

    blogPostData.upVotes++;
    await blogPostData.save();
    console.log("Blog Post Upvoted:", blogPostData);

    res.json({ success: true, upVotes: blogPostData.upVotes });
  } catch (err) {
    console.error('Error upvoting blog post:', err);
    res.status(500).json({ message: 'Error upvoting blog post', error: err });
  }
});


// route to handle downVote button click
router.put('/downvote/:id', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id);
    if (!blogPostData) {
      console.log("No Blog Post Found:", req.params.id);
      return res.status(404).json({ message: 'Post not found' });
    }

    blogPostData.downVotes++;
    await blogPostData.save();
    console.log("Blog Post Downvoted:", blogPostData);

    res.json({ success: true, downVotes: blogPostData.downVotes });
  } catch (err) {
    console.error('Error downvoting blog post:', err);
    res.status(500).json({ message: 'Error downvoting blog post', error: err });
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
      res.redirect('/homepage');

    });
  } catch (err) {
    console.error('Sign-in Error:', err);
    res.status(400).json(err);
  }
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