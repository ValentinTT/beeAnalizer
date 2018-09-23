const routes = require('express').Router();
const passport = require('passport');
//log in 
routes.get('/login', (req, res) => {
  res.render('login');
});

//log out 
routes.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//auth with google+
routes.get('/google', passport.authenticate('google', {
  //what I want from google+ user's account
  scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

//calback route for google to redirect to
routes.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    req.session.token = req.user.token;
    res.redirect('/profile');
  }
);

export const Router = routes;