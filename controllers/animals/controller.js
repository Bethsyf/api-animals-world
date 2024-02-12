const { ObjectId } = require('mongodb');

const db = require('../../db/db.js');

const getAnimals = async (req, res, next) => {
  try {
    const animals = await db
      .getDatabase()
      .collection('animals')
      .find()
      .toArray();
    console.log(animals);
    res.json(animals);
  } catch (error) {
    next(error);
  }
};

const getAnimalById = async (id) => {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error('Invalid animal ID format');
    }

    const animal = await db
      .getDatabase()
      .collection('animals')
      .findOne({ _id: new ObjectId(id) });

    if (!animal) {
      return null;
    }

    return animal;
  } catch (error) {
    console.error('Error fetching animal by ID:', error);

    return Promise.reject({
      message: 'Animal not found, or an error occurred fetching it.',
    });
  }
};

const createAnimal = async (req, res, next) => {
  try {
    console.log(req.body);
    const userData = req.body;

    const requiredFields = ['name', 'origin', 'image', 'diet', 'skills'];
    if (
      !requiredFields.every((field) => Object.keys(userData).includes(field))
    ) {
      console.log('Missing required fields:', userData);
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await db
      .getDatabase()
      .collection('animals')
      .insertOne(userData);

    console.log('MongoDB Insert Result:', result);

    if (result.insertedCount > 0 || result.insertedId) {
      console.log('Animal created successfully:', result.insertedId);
      return res.json({
        message: 'Animal created successfully',
        userId: result.insertedId,
      });
    } else {
      console.error('Failed to create user. MongoDB response:', result);
      return res
        .status(500)
        .json({ message: 'Failed to create user in the application' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return res
      .status(500)
      .json({ message: 'Failed to create user due to an unexpected error' });
  }
};

const updateAnimal = async (req, res, next) => {
  try {
    const animalId = req.params.id;
    const updatedFields = req.body;

    console.log('Animal ID:', animalId);

    if (!ObjectId.isValid(animalId)) {
      console.error('Invalid animal ID:', animalId);
      return res.status(400).json({ message: 'Invalid animal ID' });
    }

    console.log('Valid animal ID:', animalId);

    delete updatedFields._id;

    const result = await db
      .getDatabase()
      .collection('animals')
      .findOneAndUpdate(
        { _id: new ObjectId(animalId) },
        { $set: updatedFields },
        { returnDocument: 'after' }
      );

    console.log('MongoDB result:', result);

    if (result.value) {
      console.log('Animal updated successfully:', animalId);
      return res.json({
        message: 'Animal updated successfully',
        updatedAnimal: result.value,
      });
    } else {
      console.error('Failed to update animal:', animalId);
      return res.status(404).json({ message: 'Animal not found' });
    }
  } catch (error) {
    console.error('Error updating animal:', error);
    return res.status(500).json({
      message: 'Failed to update animal due to an unexpected error',
    });
  }
};

const deleteAnimal = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const filtroAnimal = { _id: new ObjectId(id) };
    const baseDeDatos = db.getDatabase();
    const result = await baseDeDatos
      .collection('animals')
      .deleteOne(filtroAnimal);

    console.log('MongoDB Delete Result:', result);

    if (result.deletedCount > 0) {
      console.log('Animal deleted successfully:', id);
      return res.json({ message: 'Animal deleted successfully' });
    } else {
      console.error('Failed to delete animal. MongoDB response:', result);
      return res
        .status(404)
        .json({ message: 'Animal not found or already deleted' });
    }
  } catch (error) {
    console.error('Error deleting animal:', error);
    return res
      .status(500)
      .json({ message: 'Failed to delete animal due to an unexpected error' });
  }
};

module.exports = {
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalById,
};
