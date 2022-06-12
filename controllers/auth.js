const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1]
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false
    })
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    })
}

exports.postLogin = (req, res, next) => {
    User.findById('629fce142321018f9c1327bd')
        .then(user => {
            req.session.isLoggedIn = true
            req.session.user = user
            req.session.save((err) => {
                console.log('postLogin: ',err)
                res.redirect('/')
            })
        })
        .catch(err => console.log('err: ', err))
}

exports.postSignup = (req, res, next) => {}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log('error: ', err)
        res.redirect('/')
    })
}