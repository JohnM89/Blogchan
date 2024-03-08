const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User');
db.BlogPost = require('./BlogPost');
db.Comment = require('./Comment');

// constraint issue solution
db.Comment.belongsTo(db.User, {
  foreignKey: 'authorId',
  constraints: true, 
  onDelete: 'CASCADE', 
  onUpdate: 'CASCADE', 
  name: 'fk_author_id' 
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
