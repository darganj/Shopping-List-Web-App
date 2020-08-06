/*Template for making a new router for a view. To add this route into code add following in app.js
 * app.use('/routepath',require('javascriptfile.js'));*/


var express = require('express'); //Have to require express again since this is a separate js file
var router = express.Router(); //Creates the router middleware variable


// Get UserName
/*
function getUserName(res, userID, connection, context, complete) { //if any info required for query, need it here as well

    var query = "SELECT * FROM Users WHERE Users.userID = ?";
    console.log("Implementing the query...");
    connection.query(query, userID, function (err, results, fields) {
        if (err) {
            console.log("Danger, Danger Will Robinson");
            next(err);
            return;

        }
        console.log("Querying completed...");
        context.userlists = results; //Can't just put results in context, will cause problems
        console.log("Stored results in userlists...");
        complete(); //Routes back to your router function so data can be displayed
    });

}
*/

/*Sample Get Route, Some imporant notes:
 * Must be router.path, not app.path
 * Whatever 'use' route you put in app.js to get here, that is already accounted for
 * For example if i put in app.js app.use'/routepath' to get here then this route will work for www.website/routepath
 * If I put /routepath in this router then the route to get there would be www.website/routepath/routepath*/


// Display page
router.get('/', function (req, res, next) { //Include any data required for query as well
    var context = {};
    // context.userID = res.query.userID; // get the datavariable for userID
    var userID = req.body.userID;
    var userName = req.body.userName;
    
    
    var callbackcount = 0; //Used to test query worked
    var connection = req.app.get('connection'); //You must put this in every route, this pulls database connection into route
    console.log(1);
    
    //var query = "SELECT * FROM Users WHERE Users.userID = ?";
    connection.query("SELECT * FROM Users WHERE Users.userID=4", userID, function(err, result){
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
