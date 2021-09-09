const express = require('express');
const csrf = require('csurf');
const flash = require('connect-flash'); // Для вывода сообщений об ошибках
const mongoose = require('mongoose');
const path = require('path');
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session); // Для сохранения сессии в базе
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

//Импортированые роуты
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

// Для подключения к базе
const password = 'Peb3m5ETUxwa70vS';
const url = `mongodb+srv://kutuzov:${password}@cluster0.th00w.mongodb.net/shop`;

const store = new MongoStore({
    collection: 'sessions',
    uri: url
})

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

app.use(express.static(path.join(__dirname, 'public'))); // Указываем статику
app.use(express.urlencoded({extended: true}));

// Настройка сессии
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// Подключили свой middleware
app.use(csrf());
app.use(flash());
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

const start = async ()=>{
    await mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }) //Конект к базе
        .then( async ()=>{
            console.log(`MongoDB is connected ...`);
            app.listen(PORT, ()=>{
                console.log(`Server is started in ${PORT}!`);
            })
        }).catch(err=>{
            console.log(err)
        });
}

start();

