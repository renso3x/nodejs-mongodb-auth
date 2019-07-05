const mongoose = require('mongoose');

const isValidId = (req, res, next) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!isValid) {
    return res.status(404).send("Sorry, you're id is malformed.");
  }

  next();
};

module.exports = {
  isValidId: isValidId,
};