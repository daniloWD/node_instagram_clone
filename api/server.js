var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var cors = require('cors');
var ObjectID = require('mongodb').ObjectId;

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017, {}),
    {}
);

console.log("Servidor HTTP está escutando na porta " + port);

app.get('/', function (req, res) {
    res.send({ msg: 'Olá' })
});

app.route('/api')
    .get(function (req, res) {
        db.open(function (err, mongoclient) {
            mongoclient.collection('postagens', function (err, collection) {
                collection.find().toArray(function (err, results) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(results);
                    }
                    mongoclient.close();
                });
            });
        });

    })
    .post(function (req, res) {
        var dados = req.body;

        db.open(function (err, mongoclient) {
            mongoclient.collection('postagens', function (err, collection) {
                collection.insert(dados, function (err, records) {
                    if (err) {
                        res.json({ 'status': 'erro' });
                    } else {
                        res.json({ 'status': 'inclusão realizada com sucesso' });
                    }
                    mongoclient.close();
                });
            });
        });
    });

   
    app.route('/api/:id')
    // Get by ID(ready)
    .get(function (req, res) {
        db.open(function (err, mongoclient) {
            mongoclient.collection('postagens', function (err, collection) {
                collection.find(ObjectID(req.params.id)).toArray(function (err, results) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.status(200).json(results);
                    }
                    mongoclient.close();
                });


            });
        });
    })
    // Put by ID(update)
    .put(function (req, res) {
        db.open(function (err, mongoclient) {
            mongoclient.collection('postagens', function (err, collection) {
                collection.update(
                    { _id : ObjectID(req.params.id) },
                    {$set : {titulo : req.body.titulo}},
                    {},
                
                    function(err, records){
                        if(err){
                            res.json(err);
                        } else {
                            res.json(records);
                        }
                    });
                mongoclient.close();
                
            });
        });
    })
    // Delete by ID(update)
    .delete(function (req, res) {
        db.open(function (err, mongoclient) {
            mongoclient.collection('postagens', function (err, collection) {
                collection.remove(
                    { _id : ObjectID(req.params.id) },
                
                    function(err, records){
                        if(err){
                            res.json(err);
                        } else {
                            res.json(records);
                        }
                    });
                mongoclient.close();
                
            });
        });
    })