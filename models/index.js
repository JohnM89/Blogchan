const Sequelize = require('sequelize');
const sequelize = require('../config/connection'); // Adjust the path as necessary
const User = require('./User');
const BlogPost = require('./BlogPost');
const Comment = require('./Comment');


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

module.exports = db;
