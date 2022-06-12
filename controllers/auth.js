const bcrypt = require('bcryptjs')
const User = require('../models/user')

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
    const confirmPassword = req.body.confirmPassword
    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email already exist, please enter another email')
                return res.redirect('/signup')
            }
            return bcrypt.hash(password, 12)
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