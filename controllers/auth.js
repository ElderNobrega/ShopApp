const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { validationResult } = require('express-validator')

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1]
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email and/or password.')
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true
                        req.session.user = user
                        return req.session.save((err) => {
                            console.log('postLoginUser: ',err)
                            res.redirect('/')
                        })
                    }
                    req.flash('error', 'Invalid email and/or password.')
                    res.redirect('/login')
                })
                .catch(err => {
                    console.log('postLoginDoMatch: ', err)
                })
        })
        .catch(err => console.log('err: ', err))
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg
        })
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: []}
            })
            return user.save()
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => {
            console.log('postSignup: ', err)
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log('error: ', err)
        res.redirect('/')
    })
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log('postReset: ', err)
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', `No account with ${req.body.email} found.`)
                    return res.redirect('/reset')
                }
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
            })
            .then(result => {
                req.flash('error', `reset password token: ${token}`)
                res.redirect('/reset')
            })
            .catch(err => {
                console.log('postReset: ', err)
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            let message = req.flash('error')
            if (message.length > 0) {
                message = message[0]
            } else {
                message = null
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {
            console.log('getNewPassword: ', err)
        })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
    let resetUser;
    User.findOne({
        resetToken: passwordToken, 
        resetTokenExpiration: { $gt: Date.now() }, 
        userId: userId
    })
        .then(user => {
            resetUser = user
            return bcrypt.hash(newPassword, 12)
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword
            resetUser.resetToken = undefined
            resetUser.resetTokenExpiration = undefined
            return resetUser.save()
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => {
            console.log('postNewPassowrd: ', err)
        })
}