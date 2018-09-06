'use strict';

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);
const { PORT  } = require('./config');
const { requestLogger } = require('./middleware/logger');
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const morgan = require('morgan');
// Create an Express application
const app = express();

// Log all requests
app.use(morgan('dev'));

// Create a static webserver
app.use(express.static('public'));

// Parse request body
app.use(express.json());


app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err,list) => {
    if(err){
      return next(err);
    }
    res.json(list);
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  const { id  } = req.params;
  notes.find(id, (err, item) => {
    if(err){
      return next(err);
    }
    res.json(item);
  });
});

app.put('/api/notes/:id', (req, res, next) => {
  const { id  } = req.params;

  const updateObj = {};
  const updateFields = ['title', 'content'];
  updateFields.forEach(field => {
    if (field in req.body){
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err){
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
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

