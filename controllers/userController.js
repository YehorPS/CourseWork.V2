const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = (req, res) => {
    const { name, email, password, role } = req.body;

    User.findOne({ email }).then(user => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {
            const newUser = new User({
                name,
                email,
                password,
                role: role || 'user'  // Default role to 'user'
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ email: 'User not found' });
        }

        if (user.isBanned) {
            return res.status(403).json({ message: `User is banned. Reason: ${user.banReason}` });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = { id: user.id, name: user.name, role: user.role };

                jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err;
                    res.json({ success: true, token: 'Bearer ' + token, role: user.role });
                });
            } else {
                return res.status(400).json({ password: 'Password incorrect' });
            }
        });
    }).catch(err => {
        console.error('Error finding user:', err);
        res.status(500).json({ error: 'Server error' });
    });
};
//
