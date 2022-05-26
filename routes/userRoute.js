const express = require('express')
const router = express.Router();
const Report = require('../schema/report')
const User = require('../schema/user')
const passport = require('passport')
const asyncCatch = require('../utils/asyncCatch');
const { isLoggedIn } = require('../middleware')

router.get('/login', (req, res) => {
    res.render('user/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), (req, res) => {
    req.flash('success', 'Welcome');
    res.redirect('/user/dashboard');
})

router.get('/signup', (req, res) => {
    res.render('user/signup')
})

router.get('/dashboard', isLoggedIn, asyncCatch(async (req, res) => {
    const reports = await Report.find({ isClosed: false }).sort({ priority: 1 });
    res.render('user/dashboard', { reports, caseNature: "Open", title: "Dashboard" });
}))

router.get('/solved', isLoggedIn, asyncCatch(async (req, res) => {
    const reports = await Report.find({ isClosed: true });
    res.render('user/dashboard', { reports, caseNature: "Closed", title: "Solved Cases" });
}))



router.post('/', asyncCatch(async (req, res, next) => {
    try {
        const { firstName, lastName, username, password } = req.body;
        const user = new User({ firstName, lastName, username });
        const registeredUser = await User.register(user, password);
        req.logIn(registeredUser, err => {
            if (err) {
                return next(err);
            };
            res.redirect(`/user/dashboard`);
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/signup');
    }

}))

router.get('/face', isLoggedIn, (req, res) => {
    res.render('user/face', { result: false });
})


router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

module.exports = router;