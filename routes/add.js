const {Router} = require('express');
const router = Router();
const Course = require('../models/cours');
const auth = require('../middleware/auth'); // проверка на авторизацию

router.get('/', auth, (req, res, next)=>{
    res.render('add', {
        title : 'Добавить курс',
        isAdd: true
    });
})

router.post('/', auth, async (req, res, next)=>{
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    });
    try{
        await course.save();
        res.redirect('/courses');
    }catch (err){
        console.log(err);
    }
})

module.exports = router;