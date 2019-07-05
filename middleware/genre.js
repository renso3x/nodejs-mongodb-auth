const mongoose = require('mongoose');

// Validate object ID
module.exports.isValidId = (req, res, next) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!isValid) {
    return res.status(400).send("Sorry, you're id is malformed.");
  }

  next();
};
