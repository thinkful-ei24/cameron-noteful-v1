'use strict';

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const app = express();

app.use(express.static('public'));

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

app.listen(8080, function(){
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

