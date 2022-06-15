const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const { check, body } = require('express-validator')
const User = require('../models/user')


router.get('/login', auth.getLogin)

router.get('/signup', auth.getSignup)

router.post('/login', auth.postLogin)

router.post('/signup', [
        check('email').isEmail().withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value})
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Email already exist, please enter another email')
                        }
                    })
                // if (value === 'test@test.com') {
                //     throw new Error('This email address is forbiden! =)')
                // }
                // return true
            }),
        body('password', 'Password must be numbers and text and at least 5 characters').isLength({min: 5}).isAlphanumeric(),
        body('confirmPassword').custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Password does not match!')
            }
            return true
        })
    ], auth.postSignup)

router.post('/logout', auth.postLogout)

router.get('/reset', auth.getReset)

router.post('/reset', auth.postReset)

router.get('/reset/:token', auth.getNewPassword)

router.post('/new-password', auth.postNewPassword)

module.exports = router
