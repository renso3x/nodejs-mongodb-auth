const express = require('express');

const { Movie, validate } = require('../db/movie');
const { Genre, validateGenre } = require('../db/genre');
// returns a Router Object
const router = express.Router();

// REST API
router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.post('/', async (req, res) => {

  const { error } = validate(req.body);

  if (error) {
    res.status(500).send(error.details);
  }

  const getGenres = Promise.all(req.body.genres.map(async g => {
    const genre = await Genre.findById(g);
    return {
      _id: genre.id,
      name: genre.name
    }
  }));

  const genres = await getGenres;

  // Embedding document
  let movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genres
  });

  movie = await movie.save();

  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('genre');

  if (!movie) {
    res.status(404).send("Sorry we cannot find the movie you're looking for.");
  }
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details);
  }

  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  }, { new: true });

  if (!movie)
    return res.status(404).send("Sorry we cannot find the movie you're looking for");

  res.send(movie);
});

router.post('/:id/addGenre', async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);

  if (!genre) {
    res.status(400).send('Invalid genre');
  }

  let movie = await Movie.findByIdAndUpdate(req.params.id, {
    $push: {
      genres: {
        _id: genre.id,
        name: genre.name
      }
    }
  }, { new: true });

  res.send(movie);
});

router.put('/:id/removeGenre', async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);

  if (!genre) {
    res.status(400).send('Invalid genre');
  }

  let movie = await Movie.findById(req.params.id);
  movie.genres.pull(genre.id);
  movies = await movie.save();

  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("Sorry we cannot find the movie you're looking for");

  res.send(movie);
});

module.exports = router;