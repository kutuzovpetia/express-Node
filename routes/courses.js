const {Router} = require('express');
const router = Router();
const Course = require('../models/cours');
const auth = require('../middleware/auth'); // проверка на авторизацию

router.get('/', async (req, res, next)=>{
    const courses = await Course.find().populate('userId', 'email name');
    res.render('courses',{
        title : 'Курсы',
        isCourses: true,
        courses
    });
})

router.get('/:id', async (req,res)=>{
    const course = await Course.findById(req.params.id)

    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    })
})

router.get('/:id/edit',auth, async (req, res)=>{
    if(!req.query.allow){
       return res.redirect('/');
    }

    const course = await Course.findById(req.params.id);

    res.render('course-edit',{
        title: `Редактировать ${course.title}`,
        course
    });
})

router.post('/edit',auth, async (req, res)=>{
    const {id} = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
});

router.post('/remove',auth, async (req,res)=>{
    try {
        await Course.deleteOne({_id: req.body.id});
        res.redirect('/courses');
    }catch (err){
        console.log(err)
    }
})

module.exports = router;