const express = require('express')
const router = express.Router();
const Report = require('../schema/report')
const { isLoggedIn } = require('../middleware')
const mapToken = process.env.MAP_TOKEN;
const googleMapToken = process.env.GOOGLE_MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const asyncCatch = require('../utils/asyncCatch');

router.get('/', isLoggedIn, (req, res) => {
    res.render('report/report');
})

router.get('/:id', isLoggedIn, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const report = await Report.findById(id);
    res.render('report/showReport', { report });
}))


router.post('/', isLoggedIn, asyncCatch(async (req, res) => {
    const newReport = new Report(req.body);
    newReport.geometry = { type: "Point", coordinates: [req.body.longitude, req.body.latitude] };
    await newReport.save();
    const id = newReport.id;
    const address = await geocodingClient.reverseGeocode({
        query: newReport.geometry.coordinates
    })
        .send()
    newReport.address = address.body.features[0].place_name;
    await newReport.save();
    res.redirect(`/criminal/new/${id}`);
}))

module.exports = router;