// JavaScript source code

// var express = require('express');
// var router = express.Router();


// router.get('/', function (req, res, next) {
//     res.render('register');
// });

// router.post('/', async function (req, res, next) {
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