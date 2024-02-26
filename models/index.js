const Sequelize = require('sequelize');
const sequelize = require('../config/connection'); // Adjust the path as necessary

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
