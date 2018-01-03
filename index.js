var express = require('express');
var app = express();
var mongo = require('mongojs');
var db = mongo('localhost:27017/contacts-app', ['numbers']);
var body_parser = require('body-parser');

app.use(body_parser.json());
app.use('/', express.static(__dirname+'/static'));

app.get('/contacts', function(req, res){
  db.numbers.find(function(err, docs){
   res.json(docs);
 });
});
app.post('/contact', function(req, res){
   req.body._id = null;
   db.numbers.insert(req.body, function(err, doc){
    res.json(doc);
   });
});

app.delete('/contact/:contact_id', function(req, res){
   console.log(req.params.contact_id);
   db.numbers.remove({_id: db.ObjectId(req.params.contact_id)}, function(err, doc){
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


app.listen(3000);
console.log('running on 3000');
