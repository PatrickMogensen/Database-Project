const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//const mongoose = require('mongoose');
//const MongoStore = require('connect-mongo')(session);
const path = require('path');
const createError = require('http-errors');
const bodyParser = require('body-parser');
//const routes = require('./routes');
const loginRouter = require("./routes/loginRouter.js");
const bookRouter = require("./routes/bookRouter.js");
const mysqlRouter = require("./routes/mysqlRoutes.js");
const mongoRouter = require("./routes/mongoRoutes.js");

const mongoose = require('mongoose')

// index.js
/*
const Neode = require('neode').with({
    Book: require('./neoModels/book.js')
    //, Person: require('./models/Person')
});;

const instance = new Neode('neo4j+s://69884cf3.databases.neo4j.io', 'neo4j', 'UAYHTgTTPcry3Tr4Gb9_4aG97GkY4wTiYioukAZIqkA');
*/

const passport = require("passport");
const auth = require('./util/auth')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://TestUsername:Ut9ggksexDCo74JA@cluster0.ggjoozw.mongodb.net/?retryWrites=true&w=majority');
}

module.exports.app = (config) => {
    const app = express();
    app.use('/', express.static(path.join(__dirname, '../public')));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(session({
        secret: 'very secret 12345',
        resave: true,
        saveUninitialized: false,
    }));

    app.use(auth.initialize);
    app.use(auth.session);
    app.use(auth.setUser);

    app.use("/", loginRouter)
    app.use("/book", bookRouter);
    app.use("/mysql", mysqlRouter);
    app.use("/mongo", mongoRouter);



    // catch 404 and forward to error handler

    if (app.get('env') === 'development') {
        app.locals.pretty = true;
    }

    return app;
};