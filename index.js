const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const app = express();
const User = require('./models/user');
const session = require('express-session');
const varMiddleware = require('./middleware/variables');
const MongoStore = require('connect-mongodb-session')(session); // Для сохранения сессии в базе
const userMiddleware = require('./middleware/user');


// Для подключения к базе
const password = 'Peb3m5ETUxwa70vS';
const url = `mongodb+srv://kutuzov:${password}@cluster0.th00w.mongodb.net/shop`;

const store = new MongoStore({
    collection: 'sessions',
    uri: url
})

// Настройка сессии
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store: store
}))

//Импортированые роуты
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

// Настройки express-handlebars ***************************
const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

// Настройка HBS
app.engine('handlebars', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
// *********************************************************

// app.use(async (req,res, next)=>{
//     try{
//         const user = await User.findById('61177466c960c781f725ffa1');
//         req.user = user;
//         next();
//     }catch (err){
//         console.log(err);
//     }
// })

app.use(express.static(path.join(__dirname, 'public'))); // Указываем статику
app.use(express.urlencoded({extended: true}));



// Подключили свой middleware
app.use(varMiddleware);
app.use(userMiddleware);


// Роуты
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

// Старт
const PORT = process.env.PORT || 3000

// const createUser = (email, name, cartItems) =>{
//     const user = new User({
//         email: email,
//         name: name,
//         cart: {items: cartItems}
//     })
//     return user;
// }

const start = async ()=>{
    await mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }) //Конект к базе
        .then( async ()=>{
            console.log(`MongoDB is connected ...`);

            // const candidate = await User.findOne();
            // if (!candidate){
            //     const user = createUser('petiakutuzov@gmail.com', 'Petro', [])
            //     await user.save();
            // }

            app.listen(PORT, ()=>{
                console.log(`Server is started in ${PORT}!`);
            })
        }).catch(err=>{
            console.log(err)
        });
}

start();

