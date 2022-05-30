const express = require("express");
const passport = require("passport");
router = express.Router()
const sequelize = require("../util/database")
const models = sequelize.models

router.get('/books',async (req, res) => {
    try {
        const books = await models.book.findAll()
        res.send(books)
        console.log(books)
    } catch (error){
        console.log(error)
        res.send("error")
    }
} );

router.get('/book',async (req, res) => {
    try {
        const book = await models.book.findByPk(req.body.id)
        res.send(book)
    } catch (error){
        console.log(error)
        res.send("error")
    }} );


router.post('/book',async (req, res) => {
    try {
        const book = await models.book.create(req.body, { fields: ['title', 'author','release_date','genre' ] });
        res.send(book)
    } catch (error){
        console.log(error)
        res.send("error")
    }} );

router.put('/book',async (req, res) => {
    try {
        await models.book.update(req.body, { fields: ['title', 'author','release_date','genre',], where:{id:req.body.id} });
        res.send("updated book" )
    } catch (error){
        console.log(error)
        res.send("error")
    }} );

router.delete('/book',async (req, res) => {
    console.log(req.body.id)
    try {
        await models.book.destroy({
            where: {
                id: req.body.id
            }
        });
        res.send("Deleted book with id: " + req.body.id)
    } catch (error){
        console.log(error)
        res.send("error")
    }} );

router.post('/makeLoan',async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const book = await models.book.findByPk(req.body.id);
        if(book.status === 'available') {
            const loan = await models.loan.create({user_id:req.body.userId, book_id:book.id});
            res.send(loan)
        } else if(book.status ==='reserved') {
            const reservation = await models.reservation.findOne({where:{book_id:book.id, user_id:req.body.userId}});
            if(reservation){
                await reservation.destroy
                const loan = await models.loan.create({user_id:req.body.userId, book_id:book.id});
                res.send(loan)
            }

        }
    } catch (error){
        await t.rollback();
        console.log(error)
        res.send("error")
    }} );


module.exports = router
