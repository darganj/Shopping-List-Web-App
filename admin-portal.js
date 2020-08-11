var express = require('express');
var myConnection = require('./dbcon.js');
var connection = myConnection.connection;
var argon2 = require('argon2');
var crypto = require('crypto'); //built into Node.js, but must require it
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var express_enforces_ssl = require('express-enforces-ssl');
var ensureLoggedIn = require('connect-ensure-login');
var router = express.Router();


router.get('/', ensureLoggedIn.ensureLoggedIn('/login'),
  function(req,res,next){
  res.locals.login = req.isAuthenticated();

  var sqlOut = "SELECT userID, userName FROM Users";

  connection.query(sqlOut, async function (err, results, fields) {
        if (err) {
            console.log(err);
            next();

        }
        if (results.length != -1){
            console.log(results);
            res.render('admin-portal', {context: results});
            
        }
    });

  
});





module.exports = router;