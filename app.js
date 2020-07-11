var express = require('express');
var mysql = require('mysql');

if(process.env.JAWSDB_URL){
  var connection = mysql.createConnection(process.env.JAWSDB_URL);
}else{
;
}

var app = express();

// set handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set server info
app.disable('x-powered-by');
app.set('port', process.env.PORT || 5001);

// set using info
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// make url encoded info in query string usable
var queryParams = function(req, res, next) {
  res.parts = req.query;
  next();
};
app.use(queryParams);


var fakeData = 
            {"name":"bob", 
                "lists":
                [{"listName":"April", 
                "listItems":
                    {"item1":"apple",
                    "item2":"pear",
                    "item3":"peach"
                    }
                },
                {"listName":"May", 
                "listItems":
                    {"item1":"beetle",
                    "item2":"ant",
                    "item3":"ladybug"
                    }
                },
                {"listName":"June", 
                "listItems":
                    {"item1":"meat",
                    "item2":"meatier",
                    "item3":"meatiest"
                    }
                }]
                
            };


app.get('/',function(req,res,next){
  res.render('home');
});

app.get('/about',function(req,res,next){
  res.render('about');
});

app.get('/login',function(req,res,next){
  res.render('login');
});

app.post('/login',function(req,res,next){
  res.redirect('shoppinglist');
});

app.get('/register',function(req,res,next){
  res.render('register');
});

app.post('/register',function(req,res,next){
    res.redirect('shoppinglist');
});

app.get('/shoppinglist',function(req,res,next){
  var context = {};
  mysql.connection.query("SELECT * FROM users", function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    res.json({rows:rows});
  // res.render('shoppinglist',{fakeData:fakeData});
});

// 404 error route
app.use(function(req,res){
  res.status(404);
  res.render('404');
});
  
// 500 server error route
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});
  
// listen command
app.listen(app.get('port'), function(){
  console.log('Express started on http://' + process.env.HOSTNAME + ':' + app.get('port') + '; press Ctrl-C to terminate.');
});
