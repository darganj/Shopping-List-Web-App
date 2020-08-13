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
  deleteUser(req, res, next);
});

router.put('/', ensureLoggedIn.ensureLoggedIn('/login'),
  async function(req,res,next){
  res.locals.login = req.isAuthenticated();
  passwordUser(req, res, next);
});

router.patch('/', ensureLoggedIn.ensureLoggedIn('/login'),
  async function(req,res,next){
  res.locals.login = req.isAuthenticated();
  usernameUser(req, res, next);
});

router.get('/table', ensureLoggedIn.ensureLoggedIn('/login'),
  function(req,res,next){
  res.locals.login = req.isAuthenticated();
  getTable(res, next);
});

router.post('/admin', ensureLoggedIn.ensureLoggedIn('/login'),
  async function(req,res,next){
  res.locals.login = req.isAuthenticated();
  flipPermissions(req, res, next);
});

function getTable(res, next){
  var sqlOut = "SELECT userID, userName, isAdmin FROM Users";

  connection.query(sqlOut, function (err, rows, fields) {
        if (err) {
            console.log(err);
            next();
            return;
        }
        console.log(rows);
        res.json({rows:rows});
    });
}

function deleteUser(req, res, next){
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

          connection.query(sqlOut, [req.body.userID], function (err, rows, fields) {
            if (err) {
                console.log(err);
                next();
                return;
            }
            console.log("new");
            console.log(rows);
            getTable(res, next);
          });

          return;
        })
    });
}

async function passwordUser(req, res, next){
  var sqlOut = "SELECT * FROM Users WHERE userID=?";
  var sqlUpdate = "UPDATE Users SET password=? WHERE userID=?";

  var newPasswordInput = '';

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
          if (req.body.password === ''){
            newPasswordInput = rows[0].userName;
          }else{
            newPasswordInput = req.body.password;
          }

          const hash = await argon2.hash(newPasswordInput, salt);
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

              connection.query(sqlOut, [req.body.userID], function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    next();
                    return;
                }
                console.log("new");
                console.log(rows);
                getTable(res, next);
              });

              return;
            });

          }catch (err) {
            console.log("error in query");
            
            }
        }catch (err) {
          console.log("error in hashing");
          
          }
    });
}

async function usernameUser(req, res, next){
  console.log(req.body);

  var sqlOut = "SELECT * FROM Users WHERE userID=?";
  var sqlUpdate = "UPDATE Users SET userName=? WHERE userID=?";

  var newUsernameInput = '';

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

        if (req.body.username === ''){
          newUsernameInput = rows[0].userName;
        }else{
          newUsernameInput = req.body.username;
        }

        connection.query(sqlUpdate, [newUsernameInput, req.body.userID], function (err, rows, fields) {
          if (err) {
              console.log(err);
              next();
              return;
          }
          console.log(rows);
          console.log("I updated " + rows.affectedRows + " rows");

          connection.query(sqlOut, [req.body.userID], function (err, rows, fields) {
            if (err) {
                console.log(err);
                next();
                return;
            }
            console.log("new");
            console.log(rows);
            getTable(res, next);
          });

          return;
        })
    });
}

async function flipPermissions(req, res, next){
  console.log("flip");
  console.log(req.body);

  newPermLevel = 0;

  var sqlOut = "SELECT * FROM Users WHERE userID=?";
  var sqlUpdate = "UPDATE Users SET isAdmin=? WHERE userID=?";

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

        if (rows[0].isAdmin === 0){
          newPermLevel = 1;
        }else{
          newPermLevel = 0;
        }

        connection.query(sqlUpdate, [newPermLevel, req.body.userID], async function (err, rows, fields) {
          if (err) {
              console.log(err);
              next();
              return;
          }
          console.log(rows);
          console.log("I updated " + rows.affectedRows + " rows");

          connection.query(sqlOut, [req.body.userID], async function (err, rows, fields) {
            if (err) {
                console.log(err);
                next();
                return;
            }
            console.log("new");
            console.log(rows);
            getTable(res, next);
          });

          return;
        })
    });

}

module.exports = router;