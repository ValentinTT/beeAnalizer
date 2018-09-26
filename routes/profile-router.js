const routes = require('express').Router();

const authCheck = (req, res, next) => {
  if (!req.user)
    res.redirect('/auth/login');
  else
    next();
};

//profile 
routes.get('/', authCheck, (req, res) => {
  console.log(req.user);
  res.render('profile', {
    //apiarios: req.user.apiaries,
    avatarPhoto: req.user.googlePhotoUrl
  });
});

export const Router = routes;