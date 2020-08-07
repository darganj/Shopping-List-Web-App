var express = require('express'); //Have to require express again since this is a separate js file
var router = express.Router(); //Creates the router middleware variable


// Display page
router.get('/', function (req, res, next) { //Include any data required for query as well
    var context = {};
    var userID = req.body.userID;
    var userName = req.body.userName;

    var connection = req.app.get('connection'); //You must put this in every route, this pulls database connection into route
    console.log(1);
    
    // Display Admin UserName
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
    
    // Descending Order - Most popular to least
    if (req.query.descending){
        var popDescOrder = "SELECT Items.itemName, COUNT(List_of_Items.itemID) " +
            "FROM List_of_Items " + 
            "JOIN Items ON List_of_Items.itemID=Items.itemID " +
            "GROUP BY itemName " +
            "ORDER BY COUNT(List_of_Items.itemID) DESC";
        
        connection.query(popDescOrder, function(err, results){
            if(err){
                console.log("ERROR: Descending Order Query");
                next(err);
                return;
            };
        var context = results;
        res.render('analytics', context);
    }
    // Ascending Order - least popular to most
    else if(req.query.ascending){
            var popAscOrder = "SELECT Items.itemName, COUNT(List_of_Items.itemID) " +
            "FROM List_of_Items " + 
            "JOIN Items ON List_of_Items.itemID=Items.itemID " +
            "GROUP BY itemName " +
            "ORDER BY COUNT(List_of_Items.itemID) ASC";
            
            connection.query(popAscOrder, function(err, results){
            if(err){
                console.log("ERROR: Descending Order Query");
                next(err);
                return;
            };
        var context = results;
        res.render('analytics', context);
    }


});


module.exports = router;
