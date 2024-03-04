const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// add a new comment
router.post('/', withAuth, async (req, res) => {
  console.log("Attempting to add a new comment with data:", req.body);
  try {
    const newComment = await Comment.create({
      ...req.body,
      userId: req.session.userId,
    });
    console.log("New comment added:", newComment.toJSON()); 
    // res.status(200).json(newComment);
    res.redirect('/'); 
  } catch (err) {
    console.error("Error adding new comment:", err);
    res.status(400).json(err);
    res.redirect('/'); 
  }
});

// update a comment
router.put('/:id', withAuth, async (req, res) => {
  console.log(`Attempting to update comment ${req.params.id} with data:`, req.body);
  try {
    const commentData = await Comment.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });
    if (commentData[0] === 0) { 
      console.log("No comment found with this id for update:", req.params.id);
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    }
    console.log("Comment updated:", commentData);
    res.status(200).json(commentData);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json(err);
  }
});

// delete a comment
router.delete('/:id', withAuth, async (req, res) => {
  console.log(`Attempting to delete comment ${req.params.id}`);
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });
    if (commentData === 0) { 
      console.log("No comment found with this id for deletion:", req.params.id);
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    }
    console.log("Comment deleted:", req.params.id);
    res.status(200).json({ message: 'Comment successfully deleted' });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
