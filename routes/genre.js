const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validateGenre } = require('../db/genre');
const { isValidId } = require('../middleware/genre');

// returns a Router Object
const router = express.Router();

// REST API
router.get('/', async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.get('/:id', isValidId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return res.status(404).send("Sorry we cannot find the movie you're looking for");
  }

  res.send(genre);
});

router.put('/:id', [isValidId, auth], async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(404).send(error.details);
  }

  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name
  }, { new: true });

  res.send(genre);
});

router.delete('/:id', [auth, admin, isValidId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send("Sorry we cannot find the genre you're looking for");

  res.send(genre);
});

module.exports = router;