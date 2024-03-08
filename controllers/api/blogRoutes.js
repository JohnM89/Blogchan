const router = require('express').Router();
const { BlogPost } = require('../../models');
const withAuth = require('../../utils/auth');

// create a new blog post
// router.post('/', withAuth, async (req, res) => {
//   console.log("Attempting to create post with data:", req.body);
//   try {
//     const newPost = await BlogPost.create({
//       ...req.body,
//       userId: req.session.userId, 
//     });
//     console.log("New post created:", newPost);
//     res.redirect('/'); 
//   } catch (err) {
//     console.error("Error creating new post:", err);
//     res.status(400).json(err);
//   }
// });

// // route to render new blog post form
// router.get('/new', withAuth, async (req, res) => {
//   res.render('new-post', {
//     loggedIn: req.session.loggedIn
//   });
// });


// // update a blog post
// router.put('/:id', withAuth, async (req, res) => {
//   console.log(`Attempting to update post ${req.params.id} with data:`, req.body);
//   try {
//     const postData = await BlogPost.update(req.body, {
//       where: {
//         id: req.params.id,
//         userId: req.session.userId,
//       },
//     });
//     if (postData[0] === 0) { 
//       console.log("No post found with this id for update:", req.params.id);
//       res.status(404).json({ message: 'No post found with this id' });
//       return;
//     }
//     console.log("Post updated:", postData);
//     res.status(200).json(postData);
//   } catch (err) {
//     console.error("Error updating post:", err);
//     res.status(500).json(err);
//   }
// });

// // delete a blog post
// router.delete('/:id', withAuth, async (req, res) => {
//   console.log(`Attempting to delete post ${req.params.id}`);
//   try {
//     const postData = await BlogPost.destroy({
//       where: {
//         id: req.params.id,
//         userId: req.session.userId,
//       },
//     });
//     if (!postData) {
//       console.log("No post found with this id for deletion:", req.params.id);
//       res.status(404).json({ message: 'No post found with this id' });
//       return;
//     }
//     console.log("Post deleted:", req.params.id);
//     res.status(200).json({ message: 'Post successfully deleted' });
//   } catch (err) {
//     console.error("Error deleting post:", err);
//     res.status(500).json(err);
//   }
// });

module.exports = router;
