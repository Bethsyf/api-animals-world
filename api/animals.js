// animals.js

module.exports = async (req, res) => {
  try {
    res.status(200).send('Welcome to the API animals world');
  } catch (error) {
    console.error('Something went wrong:', error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};
