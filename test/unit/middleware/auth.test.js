const mongoose = require('mongoose');
const { User } = require('../../../db/user');
const auth = require('../../../middleware/auth');
// Unit test the auth middleware
// test the request body

describe('middleware:auth', () => {
  it('should verify token', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const token = new User(user).generateAuthToken();

    // mock the middleware
    const req = {
      header: jest.fn().mockReturnValue(token)
    };

    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toHaveProperty('_id');
    expect(req.user).toHaveProperty('isAdmin', true);
  });
});