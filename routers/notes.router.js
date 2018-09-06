'use strict';

const express = require('express');

// Load array of notes
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

const notesRouter = express.Router();

notesRouter.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err,list) => {
    if(err){
      return next(err);
    }
    res.json(list);
  });
});

notesRouter.get('/notes/:id', (req, res, next) => {
  const { id  } = req.params;
  notes.find(id, (err, item) => {
    if(err){
      return next(err);
    }
    res.json(item);
  });
});

notesRouter.post('/notes', (req, res, next) => {
  const {title, content} = req.body;

  const newItem = {title, content};
  // Never trust users - validate input
  if (!newItem.title){
    const err = new Error('Missing "title" in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item){
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

notesRouter.put('/notes/:id', (req, res, next) => {
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

notesRouter.delete('/notes/:id', (req, res, next) => {
  const { id  } = req.params;

  notes.delete(id, (err, len) => {
    if (err){
      return res.status(500).json(err);
    }
    return res.sendStatus(204);
  });
});

module.exports = {
  notesRouter
};
