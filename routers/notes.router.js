'use strict';

const express = require('express');

// Load array of notes
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

const notesRouter = express.Router();

notesRouter.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm)
    .then(list => {
      res.json(list);
    })
    .catch(err => {
      return next(err);
    }); 
});

notesRouter.get('/:id', (req, res, next) => {
  const { id  } = req.params;
  notes.find(id)
    .then(item => {
      if (item){
        res.json(item);
      }else {
        next();
      }
    })
    .catch(err => {
      return next(err);
    });
});

notesRouter.post('/', (req, res, next) => {
  const {title, content} = req.body;

  const newItem = {title, content};
  // Never trust users - validate input
  if (!newItem.title){
    const err = new Error('Missing "title" in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem)
    .then(item => {
      if (item){
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      return next(err);
    });
});

notesRouter.put('/:id', (req, res, next) => {
  const { id  } = req.params;

  const updateObj = {};
  const updateFields = ['title', 'content'];
  updateFields.forEach(field => {
    if (field in req.body){
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      return next(err);
    }); 
});

notesRouter.delete('/:id', (req, res, next) => {
  const { id  } = req.params;

  notes.delete(id)
    .then(() => {
      return res.sendStatus(204);
    })
    .catch(err => {
      return next(err);
    });
});

module.exports = {
  notesRouter
};
