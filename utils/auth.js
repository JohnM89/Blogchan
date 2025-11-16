// Middleware to check if user is authenticated
const withAuth = (req, res, next) => {
    if (req.session && req.session.loggedIn) {
        next();
    } else {
        res.redirect('/signin');
    }
};

module.exports = withAuth;
