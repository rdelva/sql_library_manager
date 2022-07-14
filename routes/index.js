var express = require('express');
const app = require('../app');
var router = express.Router();
const Book = require('../models').Book;
const { Op } = require('sequelize');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

//Test the Book model and communication with the database

// router.get('/', asyncHandler(async (req, res) => {
//   const books = await Book.findAll();
//   res.json(books);
// }));


// Home Route - redirect to books
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));


//Shows the full list of books
router.get('/books', asyncHandler(async (req, res) => {

  //http://localhost:3000/books?page=1&limit=5

  const {count, rows } = await Book.findAndCountAll(); // gets the total number of books in the db
  const limitNumber = 5; // number of items per page
  
  const page = Math.floor(count / limitNumber); // creates the pages on the bottom of the screen (number of rows / how many items per page)
  const pageNumber = req.query.page; // Page Number user selected




  //Pagination
  if(pageNumber < limitNumber ) {
    const books = await Book.findAll({ limit: 5, offset: (pageNumber * limitNumber) });
    res.render('index', { books, title: "Books", page });
  } else {
    const books = await Book.findAll({ limit: 5, offset: limitNumber });
    res.render('index', { books, title: "Books", page });

  }
  

}));


//Shows the full list of books
router.post('/books', asyncHandler(async (req, res) => {
  const searchQuery = req.body.query;
  const books = await Book.findAll({ 
    where: {
      [Op.or]: 
        { 
          title: {
            [Op.like]:`%${searchQuery}%`
          },
          author: {
            [Op.like]: `%${searchQuery}%`
          },
          genre: {
            [Op.like]: `%${searchQuery}%`
          },
          year: {
            [Op.like]: `%${searchQuery}%`
          },
        }        
    }// end of where clause
   });


  res.render('index', { books, title: "Books" });

}));



//Go to Next Page
// //Shows the full list of books
// router.get('/books?page', asyncHandler(async (req, res) => {
//   const pageNumber = req.query
//   console.log(pageNumber);
//   const books = await Book.findAll({ offset: 5, limit: 5});
//   res.render('index', { books, title: "Books" });
// }));

// //Go to Next Page
// //Shows the full list of books
// router.post('/books/next-5', asyncHandler(async (req, res) => {
//   const books = await Book.findAll({ offset: 5, limit: 5});
//   res.render('index', { books, title: "Books" });
// }));


//Shows the Create New Book Form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { title: "New Book" });
}));

//Search Data


// router.post("/book-details/search", asyncHandler(async (req, res) => {

  
//   console.log(req.params.id);
//   // try {
//   //     book = await Books.findByPk(req.params.id);
//   //     console.log(book);
//   //     if(book){
//   //       await book.update(req.body);
//   //       res.redirect("/book-details" + book.id);
//   //     } else {
//   //       res.sendStatus(404);
//   //     }
//   // } catch(error) {
//   //   if(error.name === "SequelizeValidationError") {
//   //     book = await Book.build(req.body);
//   //     book.id = req.params.id; // make sure correct article gets updated
//   //     res.render("book-details/edit/:id", { book, errors: error.errors, title: "Update Book" })
//   //   } else {
//   //     throw error;
//   //   }
//   // }
    
// }));

// Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  
  try{ 
    book = await Book.create(req.body);  
    res.redirect("/books");
  } catch(error) {
      if(error.name === "SequelizeValidationError") { // checking the error
        article = await Books.build(req.body);
        res.render("books/new", { books, errors: error.errors, title: "New Book" })
      } else {
        throw error; // error caught in the asyncHandler's catch block
      } 
  } 
}));


//Shows book detail form

router.get("/book-details/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  console.log(book);
  if(book) {
    res.render("book-details", { book, title: book.title });  
  } else {
    res.sendStatus(404);
  }
}));


//Update/Edit
router.get("/book-details/edit/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("edit", { book, title: book.title });   

  } else {
    res.sendStatus(404);
  }
}));

//Update/Edit book

router.post("/book-details/edit/:id", asyncHandler(async (req, res) => {
  let book;
  try {
      book = await Books.findByPk(req.params.id);
      console.log(book);
      if(book){
        await book.update(req.body);
        res.redirect("/book-details" + book.id);
      } else {
        res.sendStatus(404);
      }
  } catch(error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("book-details/edit/:id", { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
    
}));

//Delete Book
router.get("/books/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("delete", { book, title: book.title });   

  } else {
    res.sendStatus(404);
  }
}));


//Delete Book
router.post("/books/:id/delete", asyncHandler(async (req, res) => {
  //let book;
  try {
      let book = await Book.findByPk(req.params.id);
      console.log("Hi");
      console.log(book);
      if(book){
        await book.destroy();
        res.redirect("/");
      } else {
        res.sendStatus(404);
      }
  } catch(error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("book-details/:id/delete", { book, errors: error.errors, title: "Delete Book" })
    } else {
      throw error;
    }
  }
    
}));


//Error Handlers
router.use((req, res, next)=>{
  const err = new Error('Page Not Found');
  err.message = 'Sorry! We couldn\'t find the page you were looking for.';
  err.status = 404;
  next(err);
});

//Error Handlers
router.use((req, res, next)=>{
  const err = new Error('Server Error');
  err.message = 'Sorry! There was an unexpected error on the server.';
  err.status = 500;
  next(err);
});


router.use((err, req, res, next) => {
  res.locals.error = err;
  if(err.status === 404){
    res.render('page-not-found', {err});
  } else {
    res.render('error', {err});
  }

});

module.exports = router;
