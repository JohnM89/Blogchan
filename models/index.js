const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User');
db.BlogPost = require('./BlogPost');
db.Comment = require('./Comment');

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add your migration script here
const queryInterface = sequelize.getQueryInterface();

queryInterface.addConstraint('blogPost', {
  fields: ['authorId'],
  type: 'foreign key',
  references: {
    table: 'User',
    field: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
  name: 'authorId' // Replace with your desired custom name
});

module.exports = db;
