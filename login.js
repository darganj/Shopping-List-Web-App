// JavaScript source code

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var express_enforces_ssl = require('express-enforces-ssl');
var ensureLoggedIn = require('connect-ensure-login');
var router = express.Router();


/*Login GET Route
* Renders the Login Page for Users
*/
router.get('/', function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.render('login');
});
  
/*Login POST Route
* used for user logging in. Logs the User in and Sends them to Admin Landing 
* if they are an admin and User Landing if they are a User*/
router.post('/', passport.authenticate('local-login', {failureRedirect: '/login'}),
  function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    console.log("res.locals.user");
    console.log(res.locals.user);
    // context = {};
    // var callbackCount = 0;
    // var userName = req.body.username; //Pulls username from req.body, queries database for userID/isAdmin to render correct webpage
    // var connection = req.app.get('connection');
    console.log("res.locals.user.isAdmin");
    console.log(res.locals.user.isAdmin);
    if (res.locals.user.isAdmin==1){
        res.redirect('adminlanding');
    }else{
        res.redirect('userlanding');
    }
});

module.exports = router;