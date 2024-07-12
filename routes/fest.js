const express = require('express');
const router = express.Router();
const Fest = require('../models/fest');

// Add sport form
router.get('/add', (req, res) => {
    res.render('add-fest');
});

// Handle add sport form submission
router.post('/add', async (req, res) => {
    const { name, description } = req.body;
    const newFest = new Fest({ name, description });
    await newFest.save();
    res.redirect('/fest/list');
});

// View sports list
router.get('/list', async (req, res) => {
    const fest = await Fest.find();
    res.render('view-fest', { fest });
});

module.exports = router;
