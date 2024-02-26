const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth'); 

router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      userId: req.session.userId 
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const updatedComment = await Comment.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.session.userId 
      }
    });

    if (updatedComment) {
      res.status(200).json(updatedComment);
    } else {
      res.status(404).json({ message: 'Comment not found or user not authorized' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put('/comments/upvote/:id', withAuth, async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (comment) {
            comment.upvotes += 1; 
            await comment.save();
            res.status(200).json(comment);
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/comments/downvote/:id', withAuth, async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (comment) {
            comment.downvotes += 1; 
            res.status(200).json(comment);
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const result = await Comment.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId 
      }
    });

    if (result > 0) {
      res.status(200).json({ message: 'Comment deleted' });
    } else {
      res.status(404).json({ message: 'Comment not found or user not authorized' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
