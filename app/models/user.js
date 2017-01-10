var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');
var validate = require('mongoose-validator');

var titlize = require('mongoose-title-case');
var Schema = mongoose.Schema;

var nameValidator = [validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: "Must be atleast 3 characters,max 30 ,No Special Characters, must have space betw" +
            "een them."
    }),
    validate({
        validator: 'isLength',
        arguments: [
            3, 25
        ],
        message: 'Name should be between 3 and 25 characters'
    })
];

var emailValidator = [

    validate({ validator: 'isEmail', message: 'Not a Valid Email' }),
    validate({
        validator: 'isLength',
        arguments: [
            3, 25
        ],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var usernameValidator = [

    validate({
        validator: 'isLength',
        arguments: [
            3, 25
        ],
        message: 'Username should be between 3 and 25 characters'
    }),
    validate({ validator: 'isAlphanumeric', message: 'Username should contain number and letter only' })
];
var passwordValidator = [validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: "Password must conatin be atleast one lowercase , one uppercase, one symbol ,& at" +
            "least 8 characters and max 35 ."
    }),
    validate({
        validator: 'isLength',
        arguments: [
            8, 35
        ],
        message: 'Password should be between 8 and 35 characters'
    })
];

var UserSchema = new Schema({

    name: {
        type: String,
        required: true,
        validate: nameValidator
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        validate: usernameValidator
    },
    password: {
        type: String,
        required: true,
        validate: passwordValidator
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        validate: emailValidator

    }
});

UserSchema.pre('save', function(next) {
    // do stuff
    console.log("IN PREE");
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash) {
        // Store hash in your password DB.
        if (err) {
            next(err);
        }
        user.password = hash;
        console.log("HASH", user.password);
        next();
    });

});

UserSchema.plugin(titlize, { paths: ['name'] });

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);