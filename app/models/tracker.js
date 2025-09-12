const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Tracker = sequelize.define('tracker', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  type: {  // "goal" | "mood" | "journal"
    type: DataTypes.ENUM('goal', 'mood', 'journal'),
    allowNull: false,
  },

  // for goals
  title: { type: DataTypes.STRING },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },

  // for mood
  rating: { type: DataTypes.INTEGER }, // slider value (1–10)
  note: { type: DataTypes.STRING },

  // for journal
  content: { type: DataTypes.TEXT },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'created_At',
  updatedAt: 'updated_At',
});

module.exports = Tracker;
