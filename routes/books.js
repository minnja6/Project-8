var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

/* GET books listing. */
router.get("/", async (req, res, next) => {
  try {
    const booksPerPage = 5;
    const query = req.query.query ? req.query.query : "";
    const numPages = await Book.getNumPages(query, booksPerPage);
    const activePage = req.query.page ? parseInt(req.query.page): (numPages === 0 ? 0: 1);
    if (activePage > numPages || activePage < 0) {
      return next();
    }
    const books = await Book.findByQueryAndPagination(
      query,
      booksPerPage,
      activePage
    );
    res.locals.books = books;
    res.locals.title = "Jasmine's Book Library";
    res.locals.pages = numPages;
    res.locals.query = query;
    res.locals.activePage = activePage;
    res.render("index");
  } catch (err) {
    return next(err);
  }
});

/* GET search book. */
router.get('/search', (req, res) => {
  let query = req.query.search.toLowerCase();
  Book.findAll({
      where: {
          [Op.or]: [
              sequelize.where(
                  sequelize.fn('lower', sequelize.col('title')),
                  { [Op.like]: '%' + query + '%' },
              ),
              sequelize.where(
                  sequelize.fn('lower', sequelize.col('author')),
                  { [Op.like]: '%' + query + '%' },
              ),
              sequelize.where(
                  sequelize.fn('lower', sequelize.col('genre')),
                  { [Op.like]: '%' + query + '%' },
              ),
              sequelize.where(
                  sequelize.fn('lower', sequelize.col('year')),
                  { [Op.like]: '%' + query + '%' },
              )
          ]
      }
  }).then(books => res.render('index', { books }));
});

/* GET create new Book */
router.get('/new', function(req, res, next) {
  res.render('new-book', {book: Books.build() });
});

/* POST create new Book */
router.post('/new', function(req, res, next) {
  Books.create(req.body).then(function(){
    res.redirect('/');
  }).catch(function(err){
    if(err.name === "SequelizeValidationError") {
      res.render('new-book', {
        book: Books.build(req.body),
        title: "New title",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err) {
    res.send(500);
  });;
});

/* GET individual book */
router.get('/:id', function(req, res, next) {
  Books.findByPk(req.params.id).then(function(book){
    if(book) {
      res.render('update-book', {book: book, title: book.title, id: req.params.id});
    } else {
      res.render('page-not-found');
    }
  }).catch(function(err) {
    res.send(500);
  });
});

/* POST update individual book */
router.post('/:id', function(req, res, next) {
  Books.findByPk(req.params.id).then(function(book){
    if(book) {
      return book.update(req.body);
    } else {
      res.render('page-not-found');
    }
  }).then(function() {
    res.redirect('/');
  }).catch(function(err){
    if(err.name === "SequelizeValidationError") {
      var book = Books.build(req.body);
      book.id = req.params.id;

      res.render('update-book', {
        book: book,
        title: "Update title",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err) {
    res.send(500);
  });;
});

/* POST delete individual book */
router.post('/:id/delete', function(req, res, next) {
  Books.findByPk(req.params.id).then(function(book){
    if(book) {
      return book.destroy();
    } else {
      res.render('page-not-found');
    }
  }).then(function() {
    res.redirect('/');
  }).catch(function(err) {
    res.send(500);
  });;
});




module.exports = router;    