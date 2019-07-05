const moment = require('moment');
const request = require('supertest');
const mongoose = require('mongoose');

const { Rental } = require('../../db/rental');
const { User } = require('../../db/user');
const { Movie } = require('../../db/movie');

describe('/api/returns { customerId, movieId }', () => {
  let server;
  let rental;
  let token;
  let payload;
  let movie;
  let customerId = mongoose.Types.ObjectId();
  let movieId = mongoose.Types.ObjectId();

  // GET THE SERVER
  beforeEach(async () => {
    server = require('../../index');

    movie = new Movie({
      _id: movieId,
      title: 'One at a time',
      genres: { name: 'Adventure' },
      numberInStock: 10,
      dailyRentalRate: 2
    });

    await movie.save();

    //CREATE A RENTAL
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "John",
        isGold: true,
        phone: 23232
      },
      movie: {
        _id: movieId,
        title: 'movie 1',
        dailyRentalRate: 2
      }
    })

    await rental.save();

    token = new User().generateAuthToken();

    payload = {
      customerId,
      movieId
    };
  });

  afterEach(async () => {
    // MUST CLOSE THE SERVER IN EACH TEST
    await server.close();
    await Movie.remove({});
    await Rental.remove({});
  });

  const exec = (done) => {
    return request(server)
      .post('/api/return')
      .set('x-auth-token', token)
      .send(payload)
  }

  it('return 401 if client is not logged in', async () => {
    token = '';

    const result = await exec();

    expect(result.status).toBe(401);
  });

  it('returns 400 if customerId is not provided', async () => {
    delete payload.customerId;

    const result = await exec();

    expect(result.status).toBe(400);
  });

  it('returns 400 if movieId is not provided', async () => {
    delete payload.movieId;

    const result = await exec();

    expect(result.status).toBe(400);
  });

  it('returns 404 if no rental found for this customer/movie', async () => {
    await Rental.remove({});

    const result = await exec();

    expect(result.status).toBe(404);
  });

  it('returns 400 if rental is already processed', async () => {
    rental.dateReturned = new Date();

    await rental.save();

    const result = await exec();

    expect(result.status).toBe(400);
  });

  it('returns 200 if rental is valid', async () => {
    const result = await exec();

    expect(result.status).toBe(200);
  });

  it('returns 200 set the return date if input is valid', async () => {
    const res = await exec();
    const rentalInDB = await Rental.findById(rental._id);
    const diff = new Date - rentalInDB.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should set the rentalFee if input is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();
    const res = await exec();
    const rentalInDB = await Rental.findById(rental._id);

    expect(rentalInDB.rentalFee).toBe(14)
  });

  it('should increase the stock if input is valid', async () => {
    const res = await exec();

    const movie = await Movie.findById(rental.movie._id);

    expect(movie.numberInStock).toBe(11);
  });

  it('should the rental if input is valid', async () => {
    const res = await exec();

    // should be general
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(["rentalFee", "dateReturned", "_id", "customer", "movie", "__v", "dateOut"])
    );
  });

});