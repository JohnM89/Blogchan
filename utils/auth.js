const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'your-secret-key',
    saveUninitialized: true
}));

//not used in this project anymore
const withAuth = (req, res, next) => {
    console.log('Checking authentication...');
    if (req.session && req.session.user) {
        console.log('User is authenticated.');
        next(); 
    } else {
        console.log('User is not authenticated. Redirecting to login page...');
        res.redirect('/signin'); 
    }
};

module.exports = withAuth;
