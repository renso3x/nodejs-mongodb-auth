const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isGold: Boolean,
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: () => 'must be a valid number'
    }
  },
});

const Customer = mongoose.model('Customer', schema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(3).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().regex(/\d{3}-\d{3}-\d{4}/)
  };

  return Joi.validate(customer, schema);
}

module.exports = {
  Customer: Customer,
  validate: validateCustomer,
};
