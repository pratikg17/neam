var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = "peterparker";

module.exports = function(router) {
    // USER REGISTRATION ROUTE
    router
        .post('/users', function(req, res) {

            var user = new User();
            user.username = req.body.username;
            user.password = req.body.password;
            user.email = req.body.email;
            user.name = req.body.name;

            if (req.body.username == null || req.body.username == "" || req.body.password == null || req.body.password == "" || req.body.email == null || req.body.email == "" || req.body.name == null || req.body.name == "") {
                res.json({ success: false, message: "Ensure name, username,email and password were provided" });

            } else {

                user
                    .save(function(err) {
                        if (err) {
                            if (err.error != null) {
                                if (err.errors.name) {
                                    res.json({ success: false, message: err.errors.name.message });

                                } else if (err.errors.email) {
                                    res.json({ success: false, message: err.errors.email.message });
                                } else if (err.errors.username) {
                                    res.json({ success: false, message: err.errors.username.message });

                                } else if (err.errors.password) {
                                    res.json({ success: false, message: err.errors.password.message });
                                } else {
                                    res.json({ message: err, success: false });
                                }
                            } else if (err) {

                                if (err.code == 11000) {
                                    if (err.errmsg[61] == "u") {
                                        res.json({ success: false, message: "Username Already taken!" });
                                    } else if (err.errmsg[61] == "e") {
                                        res.json({ success: false, message: "Email Already taken!" });

                                    } else

                                        res.json({ success: false, message: "Username or Email Already taken!" });
                                } else
                                    res.json({ success: false, message: err });
                            }
                        } else {
                            res.json({ success: true, message: "User created!" })
                        }

                    });
            }

        });


    router.post('/checkusername', function(req, res) {
        User
            .findOne({ username: req.body.username })
            .select('username')
            .exec(function(err, user) {
                if (err) {
                    throw err;
                }

                if (user) {
                    res.json({ success: false, message: "That Username is already taken!" });
                } else {
                    res.json({ success: true, message: "This Username is available!" });
                }
            });
    });

    router.post('/checkemail', function(req, res) {
        User
            .findOne({ email: req.body.email })
            .select('email')
            .exec(function(err, user) {
                if (err) {
                    throw err;
                }

                if (user) {
                    res.json({ success: false, message: "That email is already taken!" });
                } else {
                    res.json({ success: true, message: "This email is available!" });
                }
            });
    });


    // USER LOGIN ROUTE http: //localhost:port/api/authenticate
    router.post('/authenticate', function(req, res) {

        User
            .findOne({ username: req.body.username })
            .select('email username password')
            .exec(function(err, user) {
                if (err) {
                    throw err;
                }

                if (!user) {
                    res.json({ success: false, message: "Could not authenticate User" });
                } else if (user) {
                    if (req.body.password) {
                        var validPassword = user.comparePassword(req.body.password);
                        if (!validPassword) {
                            res.json({ success: false, message: "Could not authenticate password" });
                        } else {

                            var token = jwt.sign({
                                username: user.username,
                                email: user.email
                            }, secret, { expiresIn: '24h' });

                            res.json({ success: true, message: 'User authenticated', token: token });
                        }
                    } else {
                        res.json({ success: false, message: "No password provided" });
                    }

                }
            });

    });

    router.use(function(req, res, next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        console.log("TOKEN IN BODY", req.body.token);
        console.log("TOKEN IN QUERY", req.body.query);
        console.log("TOKEN IN HEADER", req.headers['x-access-token']);

        console.log("TOKEN IS HERE", token);
        if (token) {
            //verify token
            jwt
                .verify(token, secret, function(err, decoded) {
                    if (err) {
                        res.json({ success: false, message: "Token Invalid" });
                    } else {

                        console.log("IN SUCCESS TOKEN");
                        req.decoded = decoded;
                        next();
                    }
                })

        } else {
            res.json({ success: false, message: "No token Provided" })
        }

    });

    router.post('/me', function(req, res) {
        res.send(req.decoded);
    });

    return router;
}