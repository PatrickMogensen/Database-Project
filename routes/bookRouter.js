const express = require("express");
const passport = require("passport");
router = express.Router()

router.get('/',(req, res) => {
    res.send("books")
} );


module.exports = router;
