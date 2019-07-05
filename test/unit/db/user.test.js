const config = require('config'); // must have a test.json in our config
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../../../db/user');

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(), //convert to the id to hexString
      isAdmin: true
    };
    const user = new User(payload);
    //generate token
    const token = user.generateAuthToken();
    //validated token
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(payload);
  });
});