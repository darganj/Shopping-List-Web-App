
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var express_enforces_ssl = require('express-enforces-ssl');
var ensureLoggedIn = require('connect-ensure-login');
var router = express.Router();

// router.get('/', /*ensureLoggedIn.ensureLoggedIn('/login'),*/ function (req, res, next) {
//   //  res.locals.login = req.isAuthenticated();

//   context = {};
//   res.locals.user.userName = context.userName;
//   res.locals.user.userID = context.userID;
//   res.render('userlanding', { context: context });

// });


// module.exports = router;

router.get('/', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    context = {};
    context.userName = res.locals.user.userName;
    context.userID = res.locals.user.userID;
  
    res.render('userlanding', { context: context });
  
  });

module.exports = router;