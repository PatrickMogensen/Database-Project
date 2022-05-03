const express = require('express')
const app = express()
const port = 3000
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser')
var session = require('express-session')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
    secret: 'cookie_secret',
    resave: true,
    saveUninitialized: true
}));





const sequelize = new Sequelize('mysql://wu9imttjcpvru1yy:ggwi3bmzj8bwk0yy@i54jns50s3z6gbjt.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/mfscf7h3iqsc5qvq'
    ,{
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    }
    });


var initModels = require("./models/init-models");
const passport = require("passport");
var LocalStrategy = require('passport-local');
var models = initModels(sequelize);

app.use(passport.authenticate('session'));


app.get('/',  async (req, res) => {
    const users = await models.user.findAll();
    console.log(req.user.name)

    res.send(req.user.name)
})

app.get('/loginFailed', async (req, res) => {
    const users = await models.user.findAll();

    res.send("login failed")
})

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/loginFailed', failureMessage: true }),
    function(req, res) {
        res.send( req.user.username);
    });

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    console.log("vi logger:" + username + password);
    const user = await models.user.findOne({where: {email: username, password: password}})
    if (user === null) {
        console.log('Not found!');
        return cb(null, false, {message: 'Incorrect username or password.'});

    } else if (user.password != password) {
        console.log("found but incorrect username or password ")
        cb(null, false, {message: 'Incorrect username or password.'});
    } else {
        console.log(user.name); // 'My Title'
        return cb(null, user);
    }

}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, name: user.name });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})