const express = require('express')
const router = express.Router();
const Criminal = require('../schema/criminal')
const Report = require('../schema/report')
const { isLoggedIn } = require('../middleware')
const asyncCatch = require('../utils/asyncCatch');


router.get('/show/:id', isLoggedIn, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const criminal = await Criminal.findById(id);
    res.render('criminal/showCriminal', { criminal });
}))

router.get('/new/:reportId', isLoggedIn, asyncCatch(async (req, res) => {
    const { reportId } = req.params;
    res.render('criminal/criminal', { reportId });
}))

router.get('/update/:id', isLoggedIn, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const criminal = await Criminal.findById(id);
    res.render('criminal/update', { criminal });
}))

router.post('/:reportId', isLoggedIn, asyncCatch(async (req, res) => {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    const newCriminal = new Criminal(req.body);
    report.criminal = newCriminal;
    newCriminal.report = report;
    await report.save();
    await newCriminal.save();
    res.redirect(`/criminal/show/${newCriminal.id}`);
}))

module.exports = router;