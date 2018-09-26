require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Beekeeper = require('./db/models').Beekeeper;

//When the cookie goes to the browser
passport.serializeUser((user, done) => done(null, user.id));

//Call when the cookie comes back from the browser
//Atach the user to the req object
passport.deserializeUser((id, done) =>
  Beekeeper.findById(id).then(beekeeper => {
    done(null, beekeeper);
  }));

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: '/auth/google/redirect'
}, (accessToken, refreshToken, profile, done) => {
  Beekeeper.findOne({
    googleId: profile.id
  }, (err, beekeeper) => {
    if (err) done(err); //TODO: Handle db error
    else if (beekeeper) {
      beekeeper.googleName = profile.displayName;
      beekeeper.googlePhotoUrl = profile._json.image.url;
      beekeeper.save((err, beeK) => {
        if (err); //TODO: Handle db error
        else done(null, beeK);
      });
    } else { //Create new user 
      let beekeeper = new Beekeeper({
        googleId: profile.id,
        googleName: profile.displayName,
        googlePhotoUrl: profile._json.image.url
      });
      beekeeper.save((err, beeK) => {
        if (err); //TODO: Handle db error
        else done(null, beeK);
      });
    }
  });
}));