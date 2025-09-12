const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Image = sequelize.define('genimages', {
  prompt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageBase64: {  // renamed for clarity
    type: DataTypes.TEXT('long'), // can store large base64 strings
    allowNull: false
  }
});

module.exports = Image;
