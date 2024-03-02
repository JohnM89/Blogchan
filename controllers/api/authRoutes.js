const router = require('express').Router();
const { User } = require('../../models');

// Render the sign-up page or redirect if already logged in
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
  } else {
    res.render('signup', {
      pageTitle: 'Sign Up - BlogChan',
      stylesheet: '/css/style.css',
      javascript: '/js/script.js',
    });
  }
});

// Handle the sign-up form submission
router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    req.session.user_id = userData.id;
    req.session.logged_in = true;
    req.session.save(() => {
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.redirect('/signup?error=signupFailed');
  }
});

// Render the sign-in page or redirect if already logged in
router.get('/signin', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
  } else {
    res.render('signin', {
      pageTitle: 'Sign In - BlogChan',
      stylesheets: '/css/style.css',
      javascripts: '/js/script.js',
    });
  }
});

// Handle the sign-in form submission
router.post('/signin', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData || !(await userData.checkPassword(req.body.password))) {
      return res.redirect('/signin?error=invalidCredentials');
    }
    req.session.user_id = userData.id;
    req.session.logged_in = true;
    req.session.save(() => {
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.redirect('/signin?error=loginFailed');
  }
});

// Handle sign-out
router.post('/signout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
