const express = require('express');
const router = express.Router();
const passport = require('passport');
const asyncCatch = require('../utils/asyncCatch');
const { isLoggedIn } = require('../middleware');

const Report = require('../schema/report');
const User = require('../schema/user');
const Criminal = require('../schema/criminal');
const Tips = require('../schema/tips');

router.get('/', isLoggedIn, asyncCatch(async (req, res) => {
    res.render('search/search', { searched: false });
}))

router.post('/', isLoggedIn, asyncCatch(async (req, res) => {
    const { query } = req.body;
    const reports = await Report.find({ Cname: query });
    const criminals = await Criminal.find({ Sname: query });
    const tips = await Tips.find({ Cname: query });
    res.render('search/search', { searched: true, reports, criminals, tips, query })
}))



module.exports = router;