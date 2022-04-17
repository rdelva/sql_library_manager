var express = require('express');
const app = require('../app');
var router = express.Router();
const Book = require('../models').Book;

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

router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
}));


/* GET listing of all the books. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  //res.json(books);
  //console.log(books);
  //console.log(books.map(book => book.toJSON()) );
  //res.render("index", { books, title: "Books" });
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
