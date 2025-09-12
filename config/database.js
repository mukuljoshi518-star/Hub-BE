const Sequelize = require('sequelize');
const env = require('dotenv');
env.config();

const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_DATABASE = process.env.DB_DATABASE
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD

const sequelize = new Sequelize({
  dialect: 'mysql', // or postgres, sqlite, etc.
  host: DB_HOST,
  username: DB_USERNAME, // your DB username
  password: DB_PASSWORD, // your DB password
  database: DB_DATABASE, // your DB name
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;