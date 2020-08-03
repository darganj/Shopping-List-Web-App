

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var router = express.Router();


router.get('/', function (req, res, next) {
  res.locals.login = req.isAuthenticated();

  context = {};
  res.locals.user.userName = context.userName;
  res.locals.user.userID = context.userID;
  res.render('adminlanding', { context: context });
});


module.exports = router;