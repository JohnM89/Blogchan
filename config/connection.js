const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_MARIA_URL) {
    console.log('Using JAWSDB_MARIA_URL:', process.env.JAWSDB_MARIA_URL);
    sequelize = new Sequelize(process.env.JAWSDB_MARIA_URL);
} else {
    console.log('Using local database');
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306
        }
    );
}

module.exports = sequelize;
