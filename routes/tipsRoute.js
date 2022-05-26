const express = require('express')
const router = express.Router();
const Tip = require('../schema/tips')
const { isLoggedIn } = require('../middleware')
const mapToken = process.env.MAP_TOKEN;
const googleMapToken = process.env.GOOGLE_MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const asyncCatch = require('../utils/asyncCatch');


router.get('/', (req, res) => {
    res.render('tips/tips');
})

router.get('/all', isLoggedIn, asyncCatch(async (req, res) => {
    const tips = await Tip.find({ isClosed: false }).sort({ priority: 1 });
    res.render('tips/all', { reports: tips });
}))

router.get('/show/:id', isLoggedIn, asyncCatch(async (req, res) => {
    const { id } = req.params;
    const tip = await Tip.findById(id);
    res.render('tips/show', { report: tip })
}))

router.post('/', upload.array('images'), asyncCatch(async (req, res) => {

    const newTip = new Tip(req.body);
    newTip.geometry = { type: "Point", coordinates: [req.body.longitude, req.body.latitude] };
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newTip.images = images;
    const address = await geocodingClient.reverseGeocode({
        query: newTip.geometry.coordinates
    })
        .send()
    newTip.address = address.body.features[0].place_name;
    await newTip.save();
    req.flash('success', 'Tip saved!')
    res.redirect('/tips');
}))

router.post('/close/:id', asyncCatch(async (req, res) => {

    const { id } = req.params;
    const tip = await Tip.findById(id);
    tip.isClosed = true;
    await tip.save();
    res.redirect('/tips/all');
}))

module.exports = router;