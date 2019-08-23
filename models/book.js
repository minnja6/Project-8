const Sequelize = require('sequelize');
const db = require('../config/database');

const Books = db.define('book', {
    title: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: "Title is required"
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: "Author is required"
        }
      }
    },
    genre: {
      type: Sequelize.STRING
    },
    year: {
      type: Sequelize.INTEGER
    }
  });

module.exports = Books;