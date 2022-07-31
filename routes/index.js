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
  
  const page = Math.floor(count / limitNumber) - 1; // creates the pages on the bottom of the screen (number of rows / how many items per page)
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





//Shows the Create New Book Form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { title: "New Book" });
}));



// Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  
  try{ 
    book = await Book.create(req.body);  
    res.redirect("/books");
  } catch(error) {
      if(error.name === "SequelizeValidationError") { // checking the error
       
        book = await Book.build(req.body);
        console.log(book);        
        res.render("new-book", { book, errors: error.errors, title: "New Book" })
      } else {
          //throw error; // error caught in the asyncHandler's catch block
          const err = new Error(`Page Does Not Exist`);
          err.message = `Page Does Not Exist`;
          err.status = 404
          next(err)
     
      } 
  } 
}));


//Shows book detail form

router.get("/book-details/:id", asyncHandler(async (req, res,next) => {
  let book = await Book.findByPk(req.params.id);
  console.log(book);
  if(book) {
    res.render("book-details", { book, title: book.title });  
  } else {
      const err = new Error(`Book # ${req.params.id} Does Not Exist`);
      err.status = 404;
      next(err); 
  }

}));


//Update/Edit
router.get("/book-details/edit/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("edit", { book, title: book.title });   

  } else {
    const err = new Error(`Book # ${req.params.id} Does Not Exist`);
    err.status = 404;
    next(err);
 }
}));

//Update/Edit book

router.post("/book-details/edit/:id", asyncHandler(async (req, res) => {
  let book;
  try {
      book = await Book.findByPk(req.params.id);
      if(book){
        await book.update(req.body);
        res.redirect("/book-details/" + book.id);
      } else {
        res.sendStatus(404);
      }
  } catch(error) {
    if(error.name === "SequelizeValidationError") {
      //book = await Book.findByPk(req.params.id);

      book = await Book.build(req.body);
      console.log(book);
      book.id = req.params.id; // make sure correct article gets updated
      res.render("edit", { book, errors: error.errors, title: "Update Book" })
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
    const err = new Error(`Book # ${req.params.id} Does Not Exist`);
    err.status = 404;
    next(err);
   }
}));


//Delete Book
router.post("/books/:id/delete", asyncHandler(async (req, res) => {
  //let book;
  try {
      let book = await Book.findByPk(req.params.id);
      if(book){
        await book.destroy();
        res.redirect("/");
      } else {
          const err = new Error(`Book # ${req.params.id} Does Not Exist`);
          err.status = 404;
          next(err);
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





router.use((err, req, res, next) => {
  res.locals.error = err;
  if(err.status === 404){
    res.render('page-not-found', {err});
  }
   else {
    err.message =  err.message || `Sorry! There was an unexpected error on the server.`
    res.render('error', {err});
  }

});

module.exports = router;
