const router = require('express').Router();
const { User } = require('../../models');

// Sign-up new user
router.post('/signup', async (req, res) => {
  try {
    console.log("Attempting to sign up with:", req.body);
    const userData = await User.create(req.body);
    console.log("User signed up:", userData.toJSON()); // Assuming Sequelize model instance
    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;
      console.log("Session saved for sign up:", req.session);
      res.status(200).json(userData);
    });
  } catch (err) {
    console.error("Sign-up error:", err);
    res.status(400).json(err);
  }
});

// Sign-in
router.post('/signin', async (req, res) => {
  try {
    console.log("Attempting to sign in with email:", req.body.email);
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      console.log("No user found with that email");
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      console.log("Password check failed");
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;
      console.log("Session saved for sign in:", req.session);
      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json(err);
  }
});

// Sign-out
router.post('/signout', (req, res) => {
  if (req.session.loggedIn) {
    console.log("Signing out user:", req.session.userId);
    req.session.destroy(() => {
      console.log("Session destroyed for sign out");
      res.status(204).end();
    });
  } else {
    console.log("No session to destroy for sign out");
    res.status(404).end();
  }
});

module.exports = router;
