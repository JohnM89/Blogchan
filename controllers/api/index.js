const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('API routes');
});

const blogRoutes = require('./blogRoutes');
router.use('/blogs', blogRoutes);

const commentRoutes = require('./commentRoutes');
router.use('/comments', commentRoutes);

const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

module.exports = router;
