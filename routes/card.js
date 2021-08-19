const {Router} = require('express');
const router = Router();
const Course = require('../models/cours');

function mapCartItems(cart){
    return cart.items.map(c =>({
        id: c.courseId.id,
        ...c.courseId._doc,
        count: c.count
    }))
}

// Считаем общую стоимость
function computePrice(courses){
    return courses.reduce((total,course)=>{
        return total += course.price * course.count;
    }, 0)
}


router.post('/add', async (req, res)=>{
    // const course = await Course.getById(req.body.id);
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/card');
})

router.get('/', async (req, res)=>{
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();

    const courses = mapCartItems(user.cart);

    res.render('card',{
        title: 'Корзина',
        isCard: true,
        courses: courses,
        price: computePrice(courses)
    })
})

router.delete('/remove/:id', async (req, res)=>{
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    const courses = mapCartItems(user.cart)
    const c = {courses, price: computePrice(courses)}
    res.status(200).json(c)
})

module.exports = router;