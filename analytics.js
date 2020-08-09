/*Template for making a new router for a view. To add this route into code add following in app.js
 * app.use('/routepath',require('javascriptfile.js'));*/


var express = require('express'); //Have to require express again since this is a separate js file
var passport = require('passport');
var LocalStrategy = require('passport-local');
var helmet = require('helmet');
var session = require('express-session');
var express_enforces_ssl = require('express-enforces-ssl');
var ensureLoggedIn = require('connect-ensure-login');
var router = express.Router(); //Creates the router middleware variable

// Display page
router.get('/', ensureLoggedIn.ensureLoggedIn('/login'), function (req, res, next) { //Include any data required for query as well
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    var context = {};
    context.userID = res.locals.user.userName;
    context.userName = res.locals.user.userID;
  
    // var connection = req.app.get('connection'); //You must put this in every route, this pulls database connection into route
    console.log(1);
    
    res.render('analytics', {context: context});
    
    //var query = "SELECT * FROM Users WHERE Users.userID = ?";
    /* connection.query("SELECT * FROM Users WHERE Users.userID=4", userID, function(err, result){
        if(err){
            console.log("Query Error");
            next(err);
            return;
        }
        console.log(2);
        context.admin = result;
        res.render('analytics', context);
        console.log(3);
    });
    */
    
    // getUserName(res, userID, connection, context, complete); //Pulls data into context, Include any data required for query as well
    
   
    
    /*
    function complete() {
        callbackCount++;
        if (callbackCount >= 1) { //If multiple queries, need to increase
            console.log(context.userlists);
            console.log("in Complete() function now...");
            res.render('analytics', {context: context.userlists}); //If multiple queries and data, may need to adjust
        }
        console.log(3);
    }
    */
    

    // console.log(4)

});


module.exports = router;
