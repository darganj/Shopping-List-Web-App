/*Template for making a new router for a view. To add this route into code add following in app.js
 * app.use('/routepath',require('javascriptfile.js'));*/


var express = require('express'); //Have to require express again since this is a separate js file
var router = express.Router(); //Creates the router middleware variable


// Get UserName
function getUserName(res, userID, connection, context, complete) { //if any info required for query, need it here as well

    var userName = "SELECT * FROM Users WHERE Users.userID = ?";

    connection.userName(userName, userID, function (err, results, fields) {
        if (err) {
            console.log("Danger, Danger Will Robinson");
            next(err);
            return;

        }
        context.userlists = results; //Can't just put results in context, will cause problems
        complete(); //Routes back to your router function so data can be displayed
    });

}


/*Sample Get Route, Some imporant notes:
 * Must be router.path, not app.path
 * Whatever 'use' route you put in app.js to get here, that is already accounted for
 * For example if i put in app.js app.use'/routepath' to get here then this route will work for www.website/routepath
 * If I put /routepath in this router then the route to get there would be www.website/routepath/routepath*/


console.log(1);

// Display page
router.get('/', function (req, res, next) { //Include any data required for query as well
    var context = {};
    var callbackcount = 0; //Used to test query worked
    var connection = req.app.get('connection'); //You must put this in every route, this pulls database connection into route
    console.log(2);
    

    getUserName(res, userID, connection, context, complete); //Pulls data into context, Include any data required for query as well
    
    console.log(3);
    function complete() {
        callbackCount++;
        if (callbackCount >= 1) { //If multiple queries, need to increase
            console.log(context.userlists);
            console.log(4);
            res.render('analytics', context); //If multiple queries and data, may need to adjust
        }
        console.log(5);
    }

    console.log(6)

});


module.exports = router;
