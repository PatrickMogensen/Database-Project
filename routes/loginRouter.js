const express = require("express");
const passport = require("passport");
const loginController = require("./../controllers/loginController.js")
const auth = require("./../util/auth.js")
router = express.Router()

router.route("/loginFailed").get( async (req, res) => {
    //const users = await models.user.findAll();

    res.send('login failed');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginFailed',
}));

router.get('/',(req, res) => {
    res.send(req.user)
} );

router.route("/logout").post( function(req, res) {
    req.logout();
    res.send('logged out');
});

module.exports = router;
