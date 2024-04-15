const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db.js');
const cors = require('cors');
const router = require('./views/animals/routes.js');
const router1 = require('./views/animal/routes.js');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: [`${process.env.FRONTEND_BASE_URL}`],
  methods: 'GET, POST, PATCH , DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

db.connectToDatabase()
  .then(() => {
    console.log('Database connection established. Setting up routes...');

    app.use('/api/animals', router);

    app.use('/api/animal', router1);

    app.get('/api', (req, res) => {
      res.send('Welcome to the API animals world');
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);

      const errorMessage = err.message || 'Something went wrong!';

      res.status(500).send(errorMessage);
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });

process.on('SIGINT', () => {
  db.closeDatabaseConnection().then(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});
