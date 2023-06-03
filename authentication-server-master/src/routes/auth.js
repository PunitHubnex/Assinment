const router = require('express').Router();
const authControllers = require('../controllers/auth');
const { body } = require("express-validator");
const User = require("../models/users");
const isAuth = require("../middlewares/is-auth");


router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-mail address already exists');
                }

            });
        })
        .normalizeEmail(),
    body('password').trim().isLength({ min: 5 })
], authControllers.signup);


router.post('/login', authControllers.login);


router.get('/refreshAccessToken', authControllers.refreshAccessToken);


router.delete('/logout', authControllers.logout);


router.get('/userData/:id', authControllers.userData)
module.exports = router;