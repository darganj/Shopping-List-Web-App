/*Template for making a new router for a view. To add this route into code add following in app.js
 * app.use('/routepath',require('javascriptfile.js'));*/

var express = require('express'); //Have to require express again since this is a separate js file
var myConnection = require('./dbcon.js');
var connection = myConnection.connection;
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
    context.userID = res.locals.user.userID;
    context.userName = res.locals.user.userName;
  
    // var connection = req.app.get('connection'); //You must put this in every route, this pulls database connection into route
    console.log(1);
    
  
    if(res.locals.user.isAdmin != 1){
      res.redirect('userlanding');
    }else{
      res.render('analytics', { context: context });
    }
 
    // console.log(4)
/*
    if (req.query.ascending){
        var popAscOrder = "SELECT Items.itemName, COUNT(List_of_Items.itemID) AS counted " +
            "FROM List_of_Items " +
            "JOIN Items ON List_of_Items.itemID=Items.itemID " +
            "GROUP BY itemName " +
            "ORDER BY COUNT(List_of_Items.itemID) DESC";
        
        connection.query(popAscOrder, function(err, popAscResults){
            if(err){
                console.log("ERROR: Ascending Order Query");
                next(err);
                return;
            };
            context.order = popAscResults;
            console.log("Ascending Order Querying Completed");
            res.render('analytics', context);
        });
    }
    else if (req.query.descending){
        var popDescOrder = "SELECT Items.itemName, COUNT(List_of_Items.itemID) AS counted " +
            "FROM List_of_Items " +
            "JOIN Items ON List_of_Items.itemID=Items.itemID " +
            "GROUP BY itemName " +
            "ORDER BY counted ASC";
        
        connection.query(popDescOrder, function(err, popDescResults){
            if(err){
                console.log("ERROR: Descending Order Query");
                next(err);
                return;
            };
            context.order = popDescResults;
            console.log("Descending Order Querying Completed");
            res.render('analytics', context);
        });
    }
    else
    {
        var defaultOrder = "SELECT Items.itemName, COUNT(List_of_Items.itemID) AS counted " +
            "FROM List_of_Items " +
            "JOIN Items ON List_of_Items.itemID=Items.itemID " +
            "GROUP BY itemName " +
            "ORDER BY itemName ASC";
        
        connection.query(defaultOrder, function(err, defaultOrderResults){
            if(err){
                console.log("ERROR: Default Order Query");
                next(err);
                return;
            };
            context.order = defaultOrderResults;
            console.log("Default Order Querying Completed");
            res.render('analytics', context);
        });
    }
    */
    
});
        
router.get('/', function (req, res, next) { //Include any data required for query as well
    var context = {};
  
    // var connection = req.app.get('connection'); //You must put this in every route, this pulls database connection into route
    console.log(1);
    
    /*
    if(res.locals.user.isAdmin != 1){
      res.redirect('userlanding');
    }else{
      res.render('analytics', { context: context });
    }
    */
    // console.log(4)

    if (req.query.ascending){
        var popAscOrder = "SELECT Items.itemName, COUNT(List_of_Items.itemID) AS counted " +
            "FROM List_of_Items " +
            "JOIN Items ON List_of_Items.itemID=Items.itemID " +
            "GROUP BY itemName " +
            "ORDER BY COUNT(List_of_Items.itemID) DESC";
        
        connection.query(popAscOrder, function(err, popAscResults){
            if(err){
                console.log("ERROR: Ascending Order Query");
                next(err);
                return;
            };
            context.order = popAscResults;
            console.log("Ascending Order Querying Completed");
            res.render('analytics', context);
        });
    }
    else if (req.query.descending){
        var popDescOrder = "SELECT Items.itemName, COUNT(List_of_Items.itemID) AS counted " +
            "FROM List_of_Items " +
            "JOIN Items ON List_of_Items.itemID=Items.itemID " +
            "GROUP BY itemName " +
            "ORDER BY counted ASC";
        
        connection.query(popDescOrder, function(err, popDescResults){
            if(err){
                console.log("ERROR: Descending Order Query");
                next(err);
                return;
            };
            context.order = popDescResults;
            console.log("Descending Order Querying Completed");
            res.render('analytics', context);
        });
    }
    else
    {
        var defaultOrder = "SELECT Items.itemName, COUNT(List_of_Items.itemID) AS counted " +
            "FROM List_of_Items " +
            "JOIN Items ON List_of_Items.itemID=Items.itemID " +
            "GROUP BY itemName " +
            "ORDER BY itemName ASC";
        
        connection.query(defaultOrder, function(err, defaultOrderResults){
            if(err){
                console.log("ERROR: Default Order Query");
                next(err);
                return;
            };
            context.order = defaultOrderResults;
            console.log("Default Order Querying Completed");
            res.render('analytics', context);
        });
    }
    
});
    
module.exports = router;
