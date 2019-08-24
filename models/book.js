module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Title is required"
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Author is required"
        }
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };

  return Book;
};







// const Sequelize = require('sequelize');
// const db = require('../config/database');

// const Book = db.define('book', {
//     title: {
//       type: Sequelize.STRING,
//       validate: {
//         notEmpty: {
//           msg: "Title is required"
//         }
//       }
//     },
//     author: {
//       type: Sequelize.STRING,
//       validate: {
//         notEmpty: {
//           msg: "Author is required"
//         }
//       }
//     },
//     genre: {
//       type: Sequelize.STRING
//     },
//     year: {
//       type: Sequelize.INTEGER
//     }
//   });

// module.exports = Book;

