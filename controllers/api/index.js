const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('API routes');
});

const blogRoutes = require('./blogRoutes');
router.use('/', blogRoutes); 

module.exports = router;
