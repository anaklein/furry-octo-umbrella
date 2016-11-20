var express = require('express');
var cors = require('cors');
var pg = require('pg');

var app = express();

pg.defaults.ssl = true;
database = new pg.Client(process.env.DATABASE_URL);
database.connect();
query = database.query('CREATE TABLE IF NOT EXISTS images (id SERIAL PRIMARY KEY, content TEXT)');
query.on('end', function() {
  console.log('database:ok');
});

app.use(cors());
app.use(function(req, res, next) {
  req.body = '';
  req.on('data', function(chunk) { 
    req.body += chunk;
  });
  req.on('end', function() {
    next();
  });
});

app.get('/last', function(req, res) {
  database.query('SELECT * FROM "images" ORDER BY "id" DESC LIMIT 10', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/count', function(req, res) {
  database.query('SELECT COUNT(*) FROM "images"', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.get('/all', function(req, res) {
  database.query('SELECT * FROM "images" ORDER BY "id" DESC', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.post('/', function(req, res) {
  database.query('INSERT INTO "images" (content) VALUES($1)', [req.body], function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.send('true');
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log('server:ok');
});

