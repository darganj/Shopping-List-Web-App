// JavaScript source code

// var express = require('express');
// var router = express.Router();


// /*getUserAData Function
//  * This function returns data for a specified userName
//  * Input Params: - connection - existing mySQL connection to database
//  *               - userName - userName
//  * Returns:      - datablock of user data*/
// function getUserData(connection, context, userName, complete) {

//     var query = "SELECT * FROM Users Where UserName = ?";

//     connection.query(query, userName, function (err, results, fields) {
//         if (err) {
//             console.log("error");
//             next(err);
//             return;
//         }
//         context.userData = results[0];
//         complete();
//     });
// }


// /*Login GET Route
//  * Renders the Login Page for Users
//  */
// router.get('/login', function (req, res, next) {
//     res.locals.login = req.isAuthenticated();

//   res.render('login');
// });

// /*Login POST Route
//  * used for user logging in. Logs the User in and Sends them to Admin Landing 
//  * if they are an admin and User Landing if they are a User*/
// router.post('/login', passport.authenticate('local-login', {failureRedirect: '/login'}),
//     function (req, res, next) {

//         context = {};
//         var callbackCount = 0;
//         var userName = req.body.username; //Pulls username from req.body, queries database for userID/isAdmin to render correct webpage
//         var connection = req.app.get('connection');

//         getUserData(connection, context, userName, complete);
//         function complete() {
//             callbackCount++;
//             if (callbackCount >= 1) {
//                 var isAdmin = context.userData.isAdmin;
//                 var id = context.userData.userID;
//                 console.log('is it an admin ' + isAdmin);
//                 console.log('the userID is ' + id);
//                 console.log(context.userData);

//                 if (isAdmin) {
//                     res.render('adminlanding', { context: context.userData });
//                 }
//                 else {
//                     res.render('userlanding', { context: context.userData });
//                 }

//             }
//         }
//     });






// module.exports = router;