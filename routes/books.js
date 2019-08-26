var express = require('express');
var router = express.Router();
var Books = require('../models').Book;
var Sequlize = require('sequelize');
var Op = Sequlize.Op;

/* GET books listing. */
router.get('/', function(req, res, next) {
  Books.findAll({order: [["createdAt", "DESC"]] }).then(function(books) {
    res.render('index', {books: books, title: "Jasmine's Book Library"});
  }).catch(function(err) {
    res.send(500);
  });
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
router.get('/search', (req, res) => {
  const { term } = req.query;
  // term = term.toLowerCase();
  Books.findAll({where: {[Op.or]: [
      {
          title: {[Op.like] : '%' + term + '%'}
      },
      {
          author: {[Op.like] : '%' + term + '%'}
      },
      {
          genre: {[Op.like] : '%' + term + '%'}
      },
      {
          year: {[Op.like] : '%' + term + '%'}
      }
  ]}})
      .then(books => {
          res.render('search-results', {books, term});
      })
      .catch(err => console.log(err));
});



module.exports = router;    
// const express = require('express');
// const router = express.Router();
// const Book = require("../models").Book;
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'library.db'
// });

// /* GET books listing. */
// router.get("/", async (req, res, next) => {
//   try {
//     const booksPerPage = 5;
//     const query = req.query.query ? req.query.query : "";
//     const numPages = await Book.getNumPages(query, booksPerPage);
//     const activePage = req.query.page ? parseInt(req.query.page): (numPages === 0 ? 0: 1);
//     if (activePage > numPages || activePage < 0) {
//       return next();
//     }
//     const books = await Book.findByQueryAndPagination(
//       query,
//       booksPerPage,
//       activePage
//     );
//     res.locals.books = books;
//     res.locals.title = "Maliha's Awesome Library";
//     res.locals.pages = numPages;
//     res.locals.query = query;
//     res.locals.activePage = activePage;
//     res.render("index");
//   } catch (err) {
//     return next(err);
//   }
// });


// /* GET search book. */
// router.get('/search', (req, res) => {
//   const query = req.query.search.toLowerCase();

//   Book.findAll({
//       where: {
//           [Op.or]: [
//               sequelize.where(
//                   sequelize.fn('lower', sequelize.col('title')),
//                   { [Op.like]: '%' + query + '%' },
//               ),
//               sequelize.where(
//                   sequelize.fn('lower', sequelize.col('author')),
//                   { [Op.like]: '%' + query + '%' },
//               ),
//               sequelize.where(
//                   sequelize.fn('lower', sequelize.col('genre')),
//                   { [Op.like]: '%' + query + '%' },
//               ),
//               sequelize.where(
//                   sequelize.fn('lower', sequelize.col('year')),
//                   { [Op.like]: '%' + query + '%' },
//               )
//           ]
//       }
//   }).then(books => res.render('index', { books }));
// });


// /* POST create book. */
// router.post('/new', function(req, res, next) {
//   Book.create(req.body).then(function(book){
//     res.redirect("/books/" + book.id);
//   }).catch(function(err){
//     if(err.name === 'SequelizeValidationError') {
//       res.render("new", {
//         book: Book.build(req.body), 
//         title: "New Book",
//         errors: err.errors
//       });
//     } else {
//       throw err;
//     }
//   }).catch(function(err){
//     res.render('error', {message: err.message, error: err});
//   });
// });

// router.get('/new', function(req, res) {
//   res.render("new", {book: Book.build(), title: "New Book"});
// });

// /* Edit book form. */
// router.get('/:id/edit', function (req, res, next) {
//   Book.findByPk(req.params.id)
//   .then((book) => {
//     if (book) {
//       res.render('edit', { book: book, title: 'Edit Book' });
//     } else {
//       res.send(404);
//     }
//   }).catch(function(err){
//     res.send(500);
//   });
// });

// /* Delete book form. */
// router.get('/:id/delete', function (req, res, next) {
//   Book.findByPk(req.params.id).then((book) => {
//     if (book) {
//       res.render('delete', { book: book, title: 'Delete Book' });
//     } else {
//       res.send(404);
//     }
//   }).catch(function(err){
//     res.send(500);
//   });
// });

// /* GET individual book. */
// router.get('/:id', function(req, res, next) {
//   Book.findByPk(req.params.id)
//   .then((book) => {
//     if (book) {
//       res.render('show', { book, title: book.title });
//     } else {
//       res.send(404);
//       console.log('This id does not exist. Please try again.');
//     }
//   }).catch(function(err){
//     res.send(500);
//     res.render('page-not-found');
//   });
// });

// /* POST update book. */
// //update method is returning a promise passes the next value down the then chain.
// router.post('/:id/edit', function (req, res, next) {
//   Book.findByPk(req.params.id)
//   .then((book) => {
//     if (book) {
//       return book.update(req.body)
//     } else {
//       res.send(404);
//     }
//   }).then((book) => {
//     res.redirect('/books/' + book.id);
//   }).catch(function(err){
//     if(err.name === 'SequelizeValidationError') {
//       const book = Book.build(req.body);
//       book.id = req.params.id;
//       res.render("edit", {
//         book: req.body, 
//         title: "Edit Book",
//         errors: err.errors
//       });
//     } else {
//       throw err;
//     }
//   }).catch(function(err){
//     res.render('error', {err});
//   });
// });

// /* DELETE individual book. */
// //destroy method returns a promise. once the promise is fulfilled, then we redirect to the books path.
// router.post('/:id/delete', function (req, res, next) {
//   Book.findByPk(req.params.id).then((book) => {
//     if (book) {
//       return book.destroy();
//     } else {
//       res.send(404);
//     }
//   }).then(() => {
//     res.redirect('/books');
//   }).catch(function(err){
//     res.send(500);
//   });
// });

// module.exports = router;