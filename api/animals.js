// Importa el módulo de la base de datos
const db = require('../db/db.js');

// Exporta la función de manejo de la ruta de manera asíncrona
module.exports = async (req, res) => {
  try {
    // Obtiene una referencia a la base de datos
    const database = await db.connectToDatabase();

    // Verifica si la base de datos es válida antes de acceder a ella
    if (!database) {
      throw new Error('Database connection failed');
    }

    // Accede a la colección de animales en la base de datos y realiza alguna operación
    const animalsCollection = database.collection('animals');

    // Realiza alguna operación con la colección de animales (por ejemplo, encontrar todos los animales)
    const animals = await animalsCollection.find().toArray();

    // Envía la respuesta al cliente
    res.status(200).json({ animals });
  } catch (error) {
    // Maneja cualquier error que ocurra durante el proceso
    console.error('Something went wrong:', error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};
