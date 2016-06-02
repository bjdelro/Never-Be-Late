'use strict';
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');
const displayController = require('../displayController');

// http://enable-cors.org/server_expressjs.html
app.use(cors());
app.set('view engine', 'ejs');


app.get('/input', (req,res) => {
  res.render('./../home');
  res.end();
});

app.get('/display', function (req,res) {
  displayController.googleAPI(req, function(output) {
    res.render('./../display', {output: output});
  });
});

app.get('/style', (req,res) => {
  res.sendFile('/Users/bjdelro/Desktop/individualProject1/client/style.css');
});

app.get('/styleHome', (req,res) => {
  res.sendFile('/Users/bjdelro/Desktop/individualProject1/client/styleHome.css');
});

console.log('Running on port 2000');
app.listen(2000);

module.exports = app;
