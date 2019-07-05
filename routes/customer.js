const express = require('express');

const { Customer, validate } = require('../db/customer');
const { isValidId } = require('../middleware/customer');

// returns a Router Object
const router = express.Router();

// REST API
router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(500).send(error.details);
  }

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  customer = await customer.save();

  res.send(customer);
});

router.get('/:id', isValidId, async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404).send("Sorry we cannot find the customer you're looking for.");
  }
  res.send(customer);
});

router.put('/:id', isValidId, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details);
  }

  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  }, { new: true });

  if (!customer)
    return res.status(404).send("Sorry we cannot find the customer you're looking for");

  res.send(customer);
});

router.delete('/:id', isValidId, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res.status(404).send("Sorry we cannot find the customer you're looking for");

  res.send(customer);
});

module.exports = router;