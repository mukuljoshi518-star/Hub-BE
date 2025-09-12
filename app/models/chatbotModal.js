const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ChatMessage = sequelize.define('chat_messages', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  messages: {
    type: DataTypes.TEXT('long'), // stores array of Q&A in JSON format
    allowNull: false,
    defaultValue: '[]',
  },
}, {
  timestamps: true,
  createdAt: 'created_At',
  updatedAt: 'updated_At',
});

module.exports = ChatMessage;
