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

// Modify your migration script to run after the blogPost table is created
sequelize.sync({ force: true }).then(() => {
  console.log('Database synchronized');
}).then(() => {
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
}).catch((error) => {
  console.error('Error synchronizing database:', error);
});

module.exports = db;
