var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var mongo = require('mongojs');
//var db = mongo('localhost:27017/contacts-app', ['numbers','users','ratings','comments']);
var db = mongo('mongodb://admel:asja13082011.@ds159707.mlab.com:59707/webappproject', ['numbers','users','ratings','comments']);
var body_parser = require('body-parser');

app.use(body_parser.json());
app.use('/', express.static(__dirname+'/static'));

app.get('/contacts', function(req, res){
  db.numbers.find(function(err, docs){
   res.json(docs);
 });
});
app.get('/users', function(req, res){
  db.users.find(function(err, docs){
   res.json(docs);
 });
});
app.get('/ratings', function(req, res){
  var mysort = { name: 1 };
  //var query = {};
db.ratings.aggregate([{$group: {_id:"$name",  number: {$avg:"$number"} } }].sort(mysort),function(err, docs){
  //db.ratings.find(query).sort(mysort).toArray(function(err, docs){
   res.json(docs);
 });
});
app.get('/comments', function(req, res){
  db.comments.find(function(err, docs){
   res.json(docs);
 });
});

//jsonwebtoken post
app.post('/api/login', function(req,res){
  // insert code here to actually authenticate, or fake it
  const user = {id:3};
  // then return a token, secret key should be an env variable
  const token = jwt.sign({user: user.id}, 'my_secret_key');
  res.json({
    message: 'Authenticated! Use this token in the "Authorization" header',
    token:token
  });
});
app.get('/api/protected', ensureToken,function (req, res) {
  jwt.verify(req.token, 'my_secret_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        description: 'Protected information. Congrats!'
      });
    }
  });
});

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403)
  };
}

app.post('/contact', function(req, res){
   req.body._id = null;
   db.numbers.insert(req.body, function(err, doc){
    res.json(doc);
   });
});
app.post('/user', function(req, res){
   req.body._id = null;
   db.users.insert(req.body, function(err, doc){
    res.json(doc);
   });
});
app.post('/rate', function(req, res){
   req.body._id = null;
   db.ratings.insert(req.body, function(err, doc){
    res.json(doc);
   });
});
app.post('/comment', function(req, res){
   req.body._id = null;
   req.body.date = Date.now();
   db.comments.insert(req.body, function(err, doc){
    res.json(doc);
   });
});

app.delete('/contact/:contact_id', function(req, res){
   console.log(req.params.contact_id);
   db.numbers.remove({_id: db.ObjectId(req.params.contact_id)}, function(err, doc){
    res.json(doc);
   });
});
app.delete('/user/:contact_id', function(req, res){
   console.log(req.params.contact_id);
   db.users.remove({_id: db.ObjectId(req.params.contact_id)}, function(err, doc){
    res.json(doc);
   });
});

app.put('/contact/:contact_id', function(req, res){
   db.numbers.findAndModify(
    {
    query : {_id: db.ObjectId(req.params.contact_id)},
    update : {$set : {name: req.body.name, email: req.body.email, number: req.body.number}}, new: true },
    function(err, doc){
      res.json(doc);
    });
});
app.put('/user/:user_id', function(req, res){
   db.users.findAndModify(
    {
    query : {_id: db.ObjectId(req.params.user_id)},
    update : {$set : {name: req.body.name, email: req.body.email, number: req.body.number}}, new: true },
    function(err, doc){
      res.json(doc);
    });
});


app.listen(3001);
console.log('running on 3001');
