if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocal = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./schema/user');
const ExpressError = require('./utils/ExpressError');
const MongoDBStore = require('connect-mongo');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/facerapp';
const secret = process.env.SECRET || 'SECRET';

mongoose.connect(dbURL)
    .then(() => {
        console.log("Connected to database")
    })
    .catch(() => {
        console.log(err);
    })

const store = MongoDBStore.create({
    mongoUrl: dbURL,
    secret,
    touchAfter: 24 * 60 * 60
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
})




const reportRoutes = require('./routes/reportRoute');
app.use('/report', reportRoutes);

const tipsRoutes = require('./routes/tipsRoute');
app.use('/tips', tipsRoutes);

const criminalRoutes = require('./routes/criminalRoute');
app.use('/criminal', criminalRoutes);

const userRoutes = require('./routes/userRoute');
app.use('/user', userRoutes);

const faceRoutes = require('./routes/faceRoute');
app.use('/face', faceRoutes);

const searchRoutes = require('./routes/searchRoute');
app.use('/search', searchRoutes);



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Running server");
})