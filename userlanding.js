
var express = require('express');
var router = express.Router();


router.get('/', /*ensureLoggedIn.ensureLoggedIn('/login'),*/ function (req, res, next) {
  //  res.locals.login = req.isAuthenticated();
    res.render('user_landing');

});


module.exports = router;