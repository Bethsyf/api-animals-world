const express = require('express');
const controller = require('../../controllers/animals/controller');

const router = express.Router();

router.get('/', controller.getAnimals);
router.patch('/:id', controller.updateAnimal);
router.post('/', controller.createAnimal);
router.delete('/:id', controller.deleteAnimal);

module.exports = router;
