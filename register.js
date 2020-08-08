// JavaScript source code

var express = require('express');
var myConnection = require('/dbcon.js');
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


// router.get('/', function (req, res, next) {
    // res.locals.login = req.isAuthenticated();
//     res.render('register');
// });

// router.post('/', async function (req, res, next) {
    // res.locals.login = req.isAuthenticated();
//     //create salt for new user
//     const salt = crypto.randomBytes(32);
//     console.log(
//         `${salt.length} bytes of random data: ${salt.toString('hex')}`);

//     let username = req.body.username;

//     try {
//         const hash = await argon2.hash(req.body.password, salt);
//         console.log(hash);
//     } catch (err) {
//         console.log("error in hashing");
//     }

//     res.redirect('shoppinglistovw/1'); //Note: currenlty routes to shoppinglists for userID=1
// });



// module.exports = router;

router.get('/',function(req,res,next){
    res.locals.login = req.isAuthenticated();
    res.render('register');
  });
  
  
router.post('/',async function(req,res,next){
    res.locals.login = req.isAuthenticated();

    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userType = req.body.userType;

    var myDate = new Date();
    var day = myDate.getDate();
    var month = myDate.getMonth();
    var year = myDate.getFullYear();
    var dateJoined = year + month + day;
    console.log(dateJoined);

    // default is user, not admin
    var isAdmin = 0;
    if (userType == "Admin") {
        isAdmin = 1;
    }

    var sqlOut = "SELECT * FROM Users WHERE userName = ?";
    var sqlIn = "INSERT INTO Users (`username`, `password`,`isAdmin`, `firstName`, `lastName`, `dateJoined`) VALUES (?, ?, ?, ?, ?, ?)";

    console.log("picking an existing user is bad");
    if (username && password){
        connection.query(sqlOut, [username], async function (err, results, fields) {
        if (err) {
            console.log(err);
            return done(null, false);

        }
        if (results.length != 0){
            // if the query gets a user, we cannot reuse a user name
            console.log("Error:  user already exists");
            res.redirect('register');
            return;
        }

        //create salt for new user
        const salt = crypto.randomBytes(32);
        console.log(
        `${salt.length} bytes of random data: ${salt.toString('hex')}`);
        
        try {
            const hash = await argon2.hash(req.body.password, salt);
            console.log("the hash generated from the random salt and user password is:");
            console.log(hash);
            
            try{
            connection.query(sqlIn, [username, hash, isAdmin, firstName, lastName, dateJoined], function (err, results, fields) {
                if (err) {
                console.log(err);
                res.redirect('register');
        
                }else{
                    console.log("trying to fix query/promise")

                    
                    res.redirect(307,'/login'); //redirects to login post

                }
            }
            )

            }catch (err) {
            console.log("error in query");
            res.redirect('register');
            }
            



        } catch (err) {
            console.log("error in hashing");
            res.redirect('register');
        }

        


        })
    }  
    // form submitted without fields filled out correctly
    // console.log("Error:  issue with username/password submitted");
    // res.redirect('register');

});

module.exports = router;