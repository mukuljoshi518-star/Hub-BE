const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define('userdata', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_By: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updated_By: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true, 
    createdAt: 'created_At',
    updatedAt: 'updated_At',
});

module.exports = User;
