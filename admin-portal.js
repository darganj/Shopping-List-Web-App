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
  res.render('admin-portal');
});

router.delete('/', ensureLoggedIn.ensureLoggedIn('/login'),
  function(req,res,next){
  res.locals.login = req.isAuthenticated();
  getTable(res, next);
});

router.get('/table', ensureLoggedIn.ensureLoggedIn('/login'),
  function(req,res,next){
  res.locals.login = req.isAuthenticated();
  getTable(res, next);
});

function getTable(res, next){
  var sqlOut = "SELECT userID, userName FROM Users";

  connection.query(sqlOut, async function (err, rows, fields) {
        if (err) {
            console.log(err);
            next();
            return;
        }
        res.json({rows:rows});
    });
}

function deleteUser(req, next){
  var sqlOut = "SELECT userID FROM Users";
  var sqlDelete = "DELETE FROM Users WHERE userID=?"

  connection.query(sqlOut, async function (err, rows, fields) {
        if (err) {
            console.log(err);
            next();
            return;
        }
        if (rows[0].userID != req.userID){
          console.log("error finding userID");
          next();
          return;
        }
        connection.query(sqlDelete, async function (err, rows, fields) {
          if (err) {
              console.log(err);
              next();
              return;
          }
          console.log("I deleted something");
        })
        // res.json({rows:rows});
    });
}




module.exports = router;