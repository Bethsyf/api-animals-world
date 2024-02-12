const express = require('express');
const router = express.Router();
const { getAnimalById } = require('../../controllers/animals/controller');

router.get('/', async (req, res, next) => {
  const { id } = req.query;
  try {
    const animal = await getAnimalById(id);
    if (!animal) {
      res.status(404).json({ message: 'Animal not found' });
      return;
    }
    res.json(animal);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
