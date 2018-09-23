require('dotenv').config();
require('./db/connection').initDB();

const express = require('express');
const passport = require('passport');
require('./passport-setup');
const cookieSession = require('cookie-session');
const authRoutes = require('./routes/auth-routes').Router;
const profileRoutes = require('./routes/profile-router').Router;
const port = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

//Cookie and sessions with passport
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60,
    name: 'session',
    keys: [process.env.COOKIE_SESSION_KEYS]
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res, next) => {
  if (!req.user) res.redirect('auth/login');
  else res.render('/profile');
});

app.listen(port, () => console.log('App listening at port', port));