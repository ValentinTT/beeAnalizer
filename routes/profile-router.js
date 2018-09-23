const routes = require('express').Router();

const authCheck = (req, res, next) => {
  if (!req.user)
    res.redirect('/auth/login');
  else
    next();
};

//profile 
routes.get('/', authCheck, (req, res) => {
  res.render('profile');
});

export const Router = routes;