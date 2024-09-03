const express = require('express');
const bodyParser = require('body-parser');
const { connectToDb, getDb } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
app.use(bodyParser.json());

let db;

// MongoDB-ə qoşulma
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log('App running on port 3000');
    });
    db = getDb();
  }
});

// Məqalələrin siyahısını göstərmək
app.get('/posts', (req, res) => {
  db.collection('posts')
    .find()
    .toArray()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't fetch the documents" });
    });
});

// Tək bir məqaləni göstərmək
app.get('/posts/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection('posts')
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => {
        res.status(500).json({ error: "Couldn't fetch the document" });
      });
  } else {
    res.status(500).json({ error: 'Not a valid document ID' });
  }
});

// Yeni məqalə əlavə etmək
app.post('/posts', (req, res) => {
  const post = req.body;
  db.collection('posts')
    .insertOne(post)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Couldn't create the document" });
    });
});

// Mövcud məqaləni yeniləmək
app.put('/posts/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const updates = req.body;
    db.collection('posts')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Couldn't update the document" });
      });
  } else {
    res.status(500).json({ error: 'Not a valid document ID' });
  }
});

// Mövcud məqaləni silmək
app.delete('/posts/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection('posts')
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Couldn't delete the document" });
      });
  } else {
    res.status(500).json({ error: 'Not a valid document ID' });
  }
});
