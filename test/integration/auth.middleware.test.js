const request = require('supertest');
const { User } = require('../../db/user');
const { Genre } = require('../../db/genre');

describe('/auth/middleware', () => {
  let server;
  let token;
  beforeEach(() => {
    server = require('../../index');
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });
  const exec = () => {
    return request(server)
      .post('/api/genre')
      .set('x-auth-token', token)
      .send({ name: 'genre2' });
  };


  it('should return 401 if no token', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if invalid token', async () => {
    token = 'a';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if has valid token', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

});


