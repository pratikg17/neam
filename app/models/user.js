var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true

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


UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);