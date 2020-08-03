

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var router = express.Router();


router.get('/', function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.render('adminlanding');
});


module.exports = router;