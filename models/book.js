'use strict';
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  /* Returns the number of pages required based on the query and records per page. */
  Book.getNumPages = async function(query, perPage) {
    try {
      const Op = Sequelize.Op;
      const totalRecords = await this.count({
        where: {
          [Op.or]: [
            { title: { [Op.substring]: query } },
            { genre: { [Op.substring]: query } },
            { year: { [Op.substring]: query } },
            { author: { [Op.substring]: query } }
          ]
        },
        order: [["title", "ASC"]]
      });

      return Math.ceil(totalRecords / perPage);
    } catch (err) {
      throw new Error("Error getting pages");
    }
  };

/* Returns all records based on query, the current page, and books per page. */
  Book.findByQueryAndPagination = async function(
    query,
    booksPerPage,
    currentPage
  ) {
    try {
      const Op = Sequelize.Op;
      return await this.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.substring]: query } },
            { genre: { [Op.substring]: query } },
            { year: { [Op.substring]: query } },
            { author: { [Op.substring]: query } }
          ]
        },
        order: [["title", "ASC"]],
        limit: booksPerPage,
        offset: (currentPage - 1) * booksPerPage
      });
    } catch (err) {
      throw err;
    }
  };

  return Book;
};

