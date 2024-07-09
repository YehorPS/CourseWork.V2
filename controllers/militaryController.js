const Military = require('../models/Military');

exports.createMilitary = (req, res) => {
    const { firstName, lastName, middleName, rank, salary, dateEnlisted, phone, contract } = req.body;

    const enlistmentDate = new Date(dateEnlisted);
    const contractYears = contract;
    const currentDate = new Date();
    const contractEndDate = new Date(enlistmentDate.getFullYear() + contractYears, enlistmentDate.getMonth(), enlistmentDate.getDate());
    const remainingContractYears = Math.max(0, Math.ceil((contractEndDate - currentDate) / (1000 * 3600 * 24 * 365)));

    const newMilitary = new Military({
        firstName,
        lastName,
        middleName,
        rank,
        salary,
        dateEnlisted,
        phone,
        contract,
        remainingContract: remainingContractYears, // Додаємо залишок контракту
        createdBy: req.user.id
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
