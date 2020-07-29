/*Template for making a new router for a view. To add this route into code add following in app.js
 * app.use('/routepath',require('javascriptfile.js'));*/


var express = require('express'); //Have to require express again since this is a separate js file
var router = express.Router(); //Creates the router middleware variable


//Sample Query
function query(res, connection, context, complete) { //if any info required for query, need it here as well

    var query = 'SELECT * FROM TABLE';

    connection.query(query, function (err, results, fields) {
        if (err) {
            console.log("Danger, Danger Will Robinson");
            next(err);
            return;

        }
        context.context = results; //Can't just put results in context, will cause problems
        complete(); //Routes back to your router function so data can be displayed
    });

}



/*Sample Get Route, Some imporant notes:
 * Must be router.path, not app.path
 * Whatever 'use' route you put in app.js to get here, that is already accounted for
 * For example if i put in app.js app.use'/routepath' to get here then this route will work for www.website/routepath
 * If I put /routepath in this router then the route to get there would be www.website/routepath/routepath*/
router.get('/', function (req, res, next) { //Include any data required for query as well
    var context = {};
    var callbackcount = 0; //Used to test query worked
    var connection = req.app.get('connection'); //You must put this in every route, this pulls database connection into route
    
    

    query(res, connection, context, complete); //Pulls data into context, Include any data required for query as well

    function complete() {
        callbackCount++;
        if (callbackCount >= 1) { //If multiple queries, need to increase
            res.render('view', { context: context.context}); //If multiple queries and data, may need to adjust
        }
    }



});



module.exports = router;