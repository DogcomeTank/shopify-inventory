const express = require('express');
const router = express.Router();
const keys = require('../model/keys');
const myUser = require('../model/user');
const passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth20').Strategy;

//define passport usage
passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: keys.google.callbackURL
  },
  function (accessToken, refreshToken, profile, cb) {
    myUser.findOne({
      oAuthId: profile.id,
      oAuthProvider: 'google',
    }, function (err, user) {
      if (!user) {
        const newUserForInsert = {
          displayName: profile.displayName,
          email: profile.emails[0].value,
          oAuthId: profile.id,
          oAuthProvider: profile.provider,
        };
        myUser.create(newUserForInsert, (err, newInserted) => {
          return cb(err, newInserted);
        });

      } else {
        return cb(err, user);
      }
    });
  }
));


//define REST proxy options based on logged in user
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});



router.get('/',
  function (req, res) {

    if (req.user) {
      let su = req.user;
      if (typeof (req.user) === 'object') {
        su = req.user[0];
      }
      res.send('req.user:' + JSON.stringify(su.displayName));
    } else {
      res.send('not login');
    }
  });

router.get('/google-login', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));


router.get('/google-token', passport.authenticate('google', {
    failureRedirect: '/login/error'
  }),
  function (req, res) {
    var redUrl = '';
    if(req.session.currentUrl == undefined){
      redUrl = '/';
    }else{
      redUrl = req.session.currentUrl;
    }
    res.redirect(redUrl);
  });
 

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/error', function (req, res) {
  res.send('An error has occurred.');
});





module.exports = router;