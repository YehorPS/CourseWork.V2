const User = require('../models/User');

exports.getUsers = (req, res) => {
    User.find().then(users => res.json(users));
};

exports.banUser = (req, res) => {
    User.findById(req.params.id).then(user => {
        if (user) {
            user.isBanned = true;
            user.banReason = req.body.reason || 'No reason provided';
            user.save().then(updatedUser => res.json(updatedUser));
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    });
};

exports.unbanUser = (req, res) => {
    User.findById(req.params.id).then(user => {
        if (user) {
            user.isBanned = false;
            user.banReason = '';
            user.save().then(updatedUser => res.json(updatedUser));
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    });
};
