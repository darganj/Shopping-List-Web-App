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
  try{
    passwordUser(req, next);
    try{
      getTable(res, next);
    }catch (err) {
      console.log("error in getTable");
      }
  }catch (err) {
    console.log("error in passwordUser");
    }
});

router.patch('/', ensureLoggedIn.ensureLoggedIn('/login'),
  async function(req,res,next){
  res.locals.login = req.isAuthenticated();

  const promise = usernameUser(req, next);
  const promise3 = promise.then(getTable(res, next), console.log("error in usernameUser"));
  // try{
  //   await usernameUser(req, next);
  //   try{
  //     getTable(res, next);
  //   }catch (err) {
  //     console.log("error in getTable");
  //     }
  // }catch (err) {
  //   console.log("error in usernameUser");
  //   }
});

router.get('/table', ensureLoggedIn.ensureLoggedIn('/login'),
  function(req,res,next){
  res.locals.login = req.isAuthenticated();
  getTable(res, next);
});

function getTable(res, next){
  var sqlOut = "SELECT userID, userName FROM Users";

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

async function usernameUser(req, next){
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
          });



          return;
        })
        // res.json({rows:rows});
    });
}

module.exports = router;