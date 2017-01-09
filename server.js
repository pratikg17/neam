var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var socail = require('./app/passport/passport')(app, passport);


var router = express.Router();

var appRoutes = require('./app/routes/api')(router);


var path = require('path');


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);
// MONGODB CONNECTION 
mongoose.connect('mongodb://localhost:27017/mean', function(err) {
    if (err) {
        console.log("Failed to  Connection to Database");
    } else {
        console.log("Succesfully Connected");
    }
});
// NODE SERVER PORT    
app.listen(port, function() {
    console.log("Server Running on Port " + port);
});

// REQUESTSS


app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})