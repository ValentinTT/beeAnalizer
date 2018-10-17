const routes = require('express').Router();
const multer = require('multer');
const upload = multer();

const authCheck = (req, res, next) => {
  if (!req.user)
    res.redirect('/auth/login');
  else
    next();
};

//profile 
routes
  .get('/', authCheck, (req, res) => {
    res.render('profile', {
      apiarios: req.user.apiaries,
      avatarPhoto: req.user.googlePhotoUrl
    });
  })
  .post('/', authCheck, upload.any(), (req, res) => {
    console.log("req.body :", req.body);
    console.log("req.files :", req.files);
    console.log(req.files[0].buffer.toString('utf8'));
    res.redirect('/profile');
  });

export const Router = routes;