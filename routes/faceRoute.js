const express = require("express");
const faceapi = require("face-api.js");
const router = express.Router();
const mongoose = require("mongoose");
const { Canvas, Image } = require("canvas");
const canvas = require("canvas");
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { isLoggedIn } = require('../middleware')
const asyncCatch = require('../utils/asyncCatch');

faceapi.env.monkeyPatch({ Canvas, Image });

const FaceModel = require('../schema/face');
const Criminal = require('../schema/criminal');
const Report = require('../schema/report');



async function LoadModels() {
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
}
asyncCatch(LoadModels());


async function uploadLabeledImages(images, label) {
    try {
        let counter = 0;
        const descriptions = [];
        for (let i = 0; i < images.length; i++) {
            const img = await canvas.loadImage(images[i]);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            descriptions.push(detections.descriptor);
        }

        const createFace = new FaceModel({
            label: label,
            descriptions: descriptions,
        });
        await createFace.save();
        return true;
    } catch (error) {
        console.log(error);
        return (error);
    }
}

async function getDescriptorsFromDB(image) {
    let faces = await FaceModel.find();
    for (i = 0; i < faces.length; i++) {
        for (j = 0; j < faces[i].descriptions.length; j++) {
            faces[i].descriptions[j] = new Float32Array(Object.values(faces[i].descriptions[j]));
        }
        faces[i] = new faceapi.LabeledFaceDescriptors(faces[i].label, faces[i].descriptions);
    }

    const faceMatcher = new faceapi.FaceMatcher(faces, 0.6);

    const img = await canvas.loadImage(image);
    let temp = faceapi.createCanvasFromMedia(img);

    const displaySize = { width: img.width, height: img.height };
    faceapi.matchDimensions(temp, displaySize);

    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
    return results;
}



router.post("/post-face/:id", isLoggedIn, upload.array('face'), asyncCatch(async (req, res) => {
    const { id } = req.params;
    const faces = req.files.map(f => ({ url: f.path, filename: f.filename }));
    if (req.files.length < 3) {
        req.flash('error', 'Please add 3 images for best results')
        res.redirect(`/criminal/update/${id}`);
    } else {
        const label = req.body.label;
        const criminal = await Criminal.findById(id);
        criminal.faces = faces;
        await criminal.save();
        const report = await Report.findById(criminal.report);
        report.isClosed = true;
        await report.save();

        const File1 = req.files[0].path
        const File2 = req.files[1].path
        const File3 = req.files[2].path

        let result = await uploadLabeledImages([File1, File2, File3], label);
        if (result) {
            res.redirect(`/criminal/show/${criminal.id}`);
        } else {
            req.flash('error', 'Something went wrong, please try again');
            res.redirect(`/criminal/update/${id}`);
        }
    }
}))

router.post("/check-face", isLoggedIn, upload.single('face'), asyncCatch(async (req, res) => {

    const File1 = req.file.path;
    let result = await getDescriptorsFromDB(File1);
    if (result[0].label !== 'unknown') {
        const criminal = await Criminal.findById(result[0].label);
        res.render('user/face', { result: true, found: true, criminal });
    }
    else {
        res.render('user/face', { result: true, found: false });
    }
}));


router.get("/face-scan", (req, res) => {

    res.render('face');

});


module.exports = router;