// JavaScript source code

var express = require('express');
var router = express.Router();


/*isUserAdmin Function
 * This function returns if a provided userID is an admin
 * Input Params: - connection - existing mySQL connection to database
 *               - userID - userID to check
 * Returns:      - 1 if admin, 0 if user*/
function isUserAdmin(connection, userID, callback) {

    var query = "SELECT isAdmin FROM Users Where UserID = ?";

    connection.query(query, userID, function (err, results, fields) {
        if (err) {
            console.log("error");
            next(err);
            return;
        }

        return callback(results[0].isAdmin);
    });
}


/*Login GET Route
 * Renders the Login Page for Users
 */
router.get('/',function(req,res,next){
  res.render('login');
});

/*Login POST ROute
 * used for user logging in. Logs the User in and Sends them to Admin Landing 
 * if they are an admin and User Landing if they are a User*/
router.post('/', function (req, res, next) {

    //var userID = req.params.userID;  

    var userID = 2; //HARD CODE FOR NOW, INPUT 1 for ADMIN, 2 for USER
    var connection = req.app.get('connection');
    isUserAdmin(connection, userID, function (result) {
        var isAdmin = result;
        console.log('is it an admin ' + isAdmin);

        if (isAdmin) {
            res.redirect('adminlanding');
        }
        else {
            res.redirect('userlanding');
        }
    });



});


module.exports = router;