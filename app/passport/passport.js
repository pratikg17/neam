var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/user');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = "peterparker";

module.exports = function(app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false
        }
    }))

    passport.serializeUser(function(user, done) {



        token = jwt.sign({
            username: user.username,
            email: user.email
        }, secret, { expiresIn: '24h' });
        console.log("SERIALIZE TOKEN", token);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User
            .findById(id, function(err, user) {
                done(err, user);
            });
    });

    passport.use(new FacebookStrategy({
        clientID: '245747062502820',
        clientSecret: '9313fcc6e06b1f0e35bbcab87fe99c2d',
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, function(accessToken, refreshToken, profile, done) {
        // console.log("PROFILE", profile);
        User
            .findOne({ email: profile._json.email })
            .select('username password email')
            .exec(function(err, user) {
                if (err)
                    done(err);

                if (user && user != null) {
                    done(null, user);
                } else {
                    done(err);
                }
            });

    }));

    passport.use(new TwitterStrategy({
        consumerKey: 'FGqGJ6KkwENlCal9FpDsQHxET',
        consumerSecret: 'rH6mPHswFWQzZAAvzjFuPl6NxsenYPO9U0EvM5vWFjo4pHcQoC',
        callbackURL: "http://localhost:8080/auth/twitter/callback",
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"

    }, function(token, tokenSecret, profile, done) {

        // console.log(profile.emails[0].value);

        User
            .findOne({ email: profile.emails[0].value })
            .select('username password email')
            .exec(function(err, user) {
                if (err)
                    done(err);

                if (user && user != null) {
                    done(null, user);
                } else {
                    done(err);
                }
            });
    }));

    passport.use(new GoogleStrategy({
        clientID: '898275504436-ijhdb0asrt3uc3ucbcfcemm7fj0o217u.apps.googleusercontent.com',
        clientSecret: "8A6M_3Ok7FStIrs3sirLqEeG",
        callbackURL: "http://localhost:8080/auth/google/callback"
    }, function(accessToken, refreshToken, profile, done) {
        console.log(profile.emails[0].value);


        User
            .findOne({ email: profile.emails[0].value })
            .select('username password email')
            .exec(function(err, user) {
                if (err)
                    done(err);

                if (user && user != null) {
                    console.log("USER DATA FIND", user);
                    done(null, user);
                } else {
                    done(err);
                }
            });

    }));
    app.get('/auth/google',
        passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/googleerror' }),
        function(req, res) {

            console.log("HERE", token);
            res.redirect('/google/' + token);
        });
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/twittererror'
    }, function(req, res) {

        res.redirect('/twitter/');
    }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req, res) {
        console.log(token)
        res.redirect('/facebook/' + token);
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    return passport;
}