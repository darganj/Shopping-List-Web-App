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
  deleteUser(req, next);
  getTable(res, next);
});

router.put('/', ensureLoggedIn.ensureLoggedIn('/login'),
  async function(req,res,next){
  res.locals.login = req.isAuthenticated();
  passwordUser(req, next);
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
  var sqlOut = "SELECT * FROM Users WHERE userID=?";
  var sqlDelete = "DELETE FROM Users WHERE userID=?";

  console.log(req.body.userID);
  connection.query(sqlOut, [req.body.userID], function (err, rows, fields) {
        if (err) {
            console.log(err);
            next();
            return;
        }
        console.log(rows);
        if (rows[0].userID != req.body.userID){
          console.log("error finding userID");
          next();
          return;
        }
        connection.query(sqlDelete, [req.body.userID], function (err, rows, fields) {
          if (err) {
              console.log(err);
              next();
              return;
          }
          console.log(rows);
          console.log("I deleted " + rows.affectedRows + " rows");
          return;
        })
        // res.json({rows:rows});
    });
}

async function passwordUser(req, next){
  var sqlOut = "SELECT * FROM Users WHERE userID=?";
  var sqlUpdate = "UPDATE Users SET password=? WHERE userID=?";

  console.log(req.body.userID);
  connection.query(sqlOut, [req.body.userID], async function (err, rows, fields) {
        if (err) {
            console.log(err);
            next();
            return;
        }
        console.log(rows);
        if (rows[0].userID != req.body.userID){
          console.log("error finding userID");
          next();
          return;
        }

        //create new salt for user
        const salt = crypto.randomBytes(32);
        console.log(
        `${salt.length} bytes of random data: ${salt.toString('hex')}`);


        try {
          const hash = await argon2.hash(rows[0].userName, salt);
          console.log("the hash generated from the random salt and userName is:");
          console.log(hash);

          try{
            connection.query(sqlUpdate, [hash, req.body.userID], async function (err, rows, fields) {
              if (err) {
                  console.log(err);
                  next();
                  return;
              }
              console.log(rows);
              console.log("I changed " + rows.affectedRows + " rows");
              return;
            });

          }catch (err) {
            console.log("error in query");
            
            }
        }catch (err) {
          console.log("error in hashing");
          
          }
        // res.json({rows:rows});
    });
}



module.exports = router;