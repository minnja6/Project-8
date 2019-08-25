var express = require('express');
var router = express.Router();
var Books = require('../models').Book;

/* GET books listing. */
router.get('/', function(req, res, next) {
  Books.findAll({order: [["createdAt", "DESC"]] }).then(function(books) {
    res.render('index', {books: books, title: 'Books'});
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



module.exports = router;    
// const express = require('express');
// const router = express.Router();
// const Book = require("../models").Book;

// /* GET books listing. */
// router.get('/', function(req, res, next) {
//   Book.findAll({order: [["title", "ASC"]]}).then(function(books){
//     // console.log("Start: Render index of books");
//     res.render("index", { books, title: "Jasmine's SQL Library" });
//     // console.log("End: Render index of books");
//   }).catch(function(err){
//     err.statusCode = err.statusCode || 500;
//     throw err;
//     // res.send(500);
//   });
// });

// /* POST create book. */
// router.post('/new', function(req, res, next) {
//   // let {title, author, genre, year} = req.body;
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

// /* Create a new book form. */
// router.get('/new', function(req, res, next) {
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
//     // res.send(500);
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
//     }
//   }).catch(function(err){
//     // res.send(500);
//     res.render('page-not-found')
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


// // var express = require('express');
// // var router = express.Router();
// // var Book = require("../models").Book;

// // /* GET articles listing. */
// // router.get('/', function(req, res, next) {
// //   Book.findAll({order: [["createdAt", "DESC"]]}).then(function(books){
// //     res.render("books/index", {books: books, title: "My Awesome Blog" });
// //   }).catch(function(error){
// //       res.send(500, error);
// //    });
// // });

// // /* POST create article. */
// // router.post('/', function(req, res, next) {
// //   Book.create(req.body).then(function(book) {
// //     res.redirect("/books/" + book.id);
// //   }).catch(function(error){
// //       if(error.name === "SequelizeValidationError") {
// //         res.render("books/new", {book: Book.build(req.body), errors: error.errors, title: "New Book"})
// //       } else {
// //         throw error;
// //       }
// //   }).catch(function(error){
// //       res.send(500, error);
// //    });
// // ;});

// // /* Create a new article form. */
// // router.get('/new', function(req, res, next) {
// //   res.render("books/new", {book: {}, title: "New Book"});
// // });

// // /* Edit article form. */
// // router.get("/:id/edit", function(req, res, next){
// //   Book.findById(req.params.id).then(function(book){
// //     if(article) {
// //       res.render("books/edit", {book: book, title: "Edit Book"});      
// //     } else {
// //       res.send(404);
// //     }
// //   }).catch(function(error){
// //       res.send(500, error);
// //    });
// // });


// // /* Delete article form. */
// // router.get("/:id/delete", function(req, res, next){
// //   Book.findById(req.params.id).then(function(book){  
// //     if(book) {
// //       res.render("books/delete", {book: book, title: "Delete Book"});
// //     } else {
// //       res.send(404);
// //     }
// //   }).catch(function(error){
// //       res.send(500, error);
// //    });
// // });


// // /* GET individual article. */
// // router.get("/:id", function(req, res, next){
// //   Book.findById(req.params.id).then(function(article){
// //     if(book) {
// //       res.render("books/show", {article: book, title: book.title});  
// //     } else {
// //       res.send(404);
// //     }
// //   }).catch(function(error){
// //       res.send(500, error);
// //    });
// // });

// // /* PUT update article. */
// // router.put("/:id", function(req, res, next){
// //   Book.findById(req.params.id).then(function(book){
// //     if(book) {
// //       return book.update(req.body);
// //     } else {
// //       res.send(404);
// //     }
// //   }).then(function(book){
// //     res.redirect("/books/" + book.id);        
// //   }).catch(function(error){
// //       if(error.name === "SequelizeValidationError") {
// //         var book = Book.build(req.body);
// //         book.id = req.params.id;
// //         res.render("books/edit", {book: book, errors: error.errors, title: "Edit Book"})
// //       } else {
// //         throw error;
// //       }
// //   }).catch(function(error){
// //       res.send(500, error);
// //    });
// // });

// // /* DELETE individual article. */
// // router.delete("/:id", function(req, res, next){
// //   Book.findById(req.params.id).then(function(book){  
// //     if(book) {
// //       return book.destroy();
// //     } else {
// //       res.send(404);
// //     }
// //   }).then(function(){
// //     res.redirect("/books");    
// //   }).catch(function(error){
// //       res.send(500, error);
// //    });
// // });


// // module.exports = router
