const Military = require('../models/Military');

exports.createMilitary = (req, res) => {
    const newMilitary = new Military({
        name: req.body.name,
        rank: req.body.rank,
        salary: req.body.salary,
        dateEnlisted: req.body.dateEnlisted,
        createdBy: req.user.id // Сохраняем ID создателя
    });

    newMilitary.save()
        .then(military => res.json(military))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.getMilitaries = (req, res) => {
    Military.find({ createdBy: req.user.id }) // Фильтрация по ID создателя
        .sort({ dateEnlisted: -1 })
        .then(militaries => res.json(militaries))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.updateMilitary = (req, res) => {
    Military.findOneAndUpdate({ _id: req.params.id, createdBy: req.user.id }, req.body, { new: true }) // Фильтрация по ID создателя
        .then(military => {
            if (!military) {
                return res.status(404).json({ message: 'Military record not found' });
            }
            res.json(military);
        })
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.deleteMilitary = (req, res) => {
    Military.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id }) // Фильтрация по ID создателя
        .then(military => {
            if (!military) {
                return res.status(404).json({ message: 'Military record not found' });
            }
            res.json({ success: true });
        })
        .catch(err => res.status(500).json({ error: err.message }));
};
