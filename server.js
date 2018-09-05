'use strict';

// Load array of notes
const data = require('./db/notes');
const simDB = require('.db/simDB');
const notes = simDB.initialize(data);
const { PORT  } = require('./config');
const { requestLogger } = require('./middleware/logger');
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const app = express();

app.use(express.static('public'));

app.use(requestLogger);

app.get('/api/notes', (req, res) => {
  const query = req.query;
  let list = data;
  if(query.searchTerm){
    list = list.filter(i => i.title.includes(query.searchTerm));
  }
  return res.json(list);
});

app.get('/api/notes/:id', (req, res) => {
  const item = data.find(i => i.id === Number(req.params.id));
  return res.json(item);
});

app.use(function (req, res, next){
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({message: 'Not Found'});
});

app.use(function (err, req, res, next){
  res.status(err.status || 500);
  res.json({
    mesage: err.message,
    error: err
  });
});

app.listen(PORT, function(){
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

