

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var express_enforces_ssl = require('express-enforces-ssl');
var ensureLoggedIn = require('connect-ensure-login');
var router = express.Router();


router.get('/', ensureLoggedIn.ensureLoggedIn('/login'),
  function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    context = {};
    context.userName = res.locals.user.userName;
    context.userID = res.locals.user.userID;

    if(res.locals.user.isAdmin != 1){
      res.redirect('userlanding');
    }else{
      res.render('adminlanding', { context: context });
    }

    
});

module.exports = router;