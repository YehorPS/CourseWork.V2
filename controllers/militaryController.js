const Military = require('../models/Military');

exports.createMilitary = (req, res) => {
    const newMilitary = new Military({
        name: req.body.name,
        rank: req.body.rank,
        salary: req.body.salary,
        dateEnlisted: req.body.dateEnlisted
    });

    newMilitary.save()
        .then(military => res.json(military))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.getMilitaries = (req, res) => {
    Military.find()
        .sort({ dateEnlisted: -1 })
        .then(militaries => res.json(militaries))
        .catch(err => res.status(500).json({ error: err.message }));
};
exports.updateMilitary = (req, res) => {
    Military.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(military => res.json(military))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.deleteMilitary = (req, res) => {
    Military.findByIdAndDelete(req.params.id)
        .then(() => res.json({ success: true }))
        .catch(err => res.status(500).json({ error: err.message }));
};
