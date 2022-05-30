const express = require('express');
const original = express();
const port = 3000;
const loginRouter = require("./routes/loginRouter.js");

const bodyParser = require('body-parser');
original.use(bodyParser.urlencoded({extended: false}));
const urlencodedParser = bodyParser.urlencoded({extended: false});


const session = require('express-session');
original.use(session({
  secret: 'cookie_secret',
  resave: true,
  saveUninitialized: true,
}));

original.use("/", loginRouter);


// sequelize
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize('mysql://wu9imttjcpvru1yy:ggwi3bmzj8bwk0yy@i54jns50s3z6gbjt.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/mfscf7h3iqsc5qvq'
    , {
      define: {
        // prevent sequelize from pluralizing table names
        freezeTableName: true,
      },
    });
const initModels = require('./models/init-models');
const models = initModels(sequelize);


const passport = require('passport');
const LocalStrategy = require('passport-local');
original.use(passport.authenticate('session'));

require('./controllers/loginController');

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/loginFailed');
  }
}

function adminLoggedIn(req, res, next) {
  if (req.user) {
    if (req.user.role === 'admin') {
      next();
    }
  } else {
    res.redirect('/loginFailed');
  }
}

original.get('/', loggedIn, async (req, res) => {
  const users = await models.user.findAll();
  console.log(req.user.name);

  res.send(req.user.name);
});

original.use

// open endpoints
// get all books
original.get('/books/name', urlencodedParser, async (req, res) => {
  const books = await models.book.findAll();
  res.send('created book: ' + JSON.stringify(books.toJSON()));
});
// search for books like

original.get('/books/name', adminLoggedIn, urlencodedParser, async (req, res) => {
  const book = await models.book.findOne({where: {}});
  res.send('created book: ' + JSON.stringify(book.toJSON()));
});

// user endpoints

// delete reservation
original.delete('/reservation', loggedIn, urlencodedParser, async (req, res) => {
  try {
    await models.reservation.destroy({
      where: {
        book_id: req.body.id,
        user_id: req.user.reservation,
      },
    },
    );
    res.send('Deleted book with id' + req.body.id);
  } catch (error) {
    // rollback transaction
    console.log(error);
    res.send('error');
  }
});

// admin endpoints
// create book
original.post('/adminbook', adminLoggedIn, urlencodedParser, async (req, res) => {
  const book = await models.book.create({
    title: req.body.title,
    author: req.body.author,
    release_date: req.body.release_date,
    genre: req.body.genre,
  });
  res.send('created book: ' + JSON.stringify(book.toJSON()));
});
// update book
original.put('/adminbook', adminLoggedIn, urlencodedParser, async (req, res) => {
  const book = await models.book.findOne({where: {id: req.body.id}});

  book.set({
    title: req.body.title,
    author: req.body.author,
    release_date: req.body.release_date,
    genre: req.body.genre,
  }, {where: {id: req.body.id}});

  book.save();
  res.send('updated book: ' + JSON.stringify(book.toJSON()));
});

// delete book
original.delete('/adminbook', adminLoggedIn, urlencodedParser, async (req, res) => {
  const book = await models.book.destroy({
    where: {
      id: req.body.id,
    },
  });
  res.send('Deleted book with id' + req.body.id);
});


original.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
