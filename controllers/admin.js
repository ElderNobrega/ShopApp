const Product = require('../models/product');
const { validationResult } = require('express-validator')


exports.getAddProduct = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login')
    }
    res.render('admin/edit-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product({ title, imageUrl, description, price, userId: req.user });
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product', 
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    product.save()
        .then(result => {
            console.log('Created Product')
            res.redirect('/admin/products')
        }).catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
            // res.redirect('/500')
            // return res.status(500).render('admin/edit-product', {
            //     pageTitle: 'Add Product', 
            //     path: '/admin/add-product',
            //     editing: false,
            //     hasError: true,
            //     product: {
            //         title: title,
            //         imageUrl: imageUrl,
            //         price: price,
            //         description: description,
            //     },
            //     errorMessage: 'Database operation failed, please try again',
            //     validationErrors: []
            // });
    })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId
    // req.user.getProducts({ where: {id: prodId}})
    // Product.findByPk(prodId)
    Product.findById(prodId)
        .then(product => {
            if(!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product', 
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImageUrl = req.body.imageUrl
    const updatedDesc = req.body.description
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/')
            }
            product.title = updatedTitle
            product.price = updatedPrice
            product.imageUrl = updatedImageUrl
            product.description = updatedDesc
            return product.save()
                .then(result => {
                    console.log('UPDATED PRODUCT!!!');
                    res.redirect('/admin/products')
                })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
    // Product.findAll()
    .then(products => {
        res.render('admin/products', { 
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products',
        })
    }).catch(err => {
        const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
    })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.deleteOne({_id: prodId, userId: req.user._id})
        .then(() => {
            console.log('DELETED PRODUCT')
            res.redirect('/admin/products')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

//mysql version
/* const product = new Product(null, title, imageUrl, description, price)
product.save()
    .then(() => {
        res.redirect('/')
    })
    .catch(err => console.log(err)) */

//Sequelize code
/* exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    req.user
        .createProduct({
            title,
            price,
            imageUrl,
            description,
        })
        .then(result => {
            console.log('Created Product')
            res.redirect('/admin/products')
        }).catch(err => {
            console.log(err)
    }) */
/* exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId
    req.user.getProducts({ where: {id: prodId}})
    // Product.findByPk(prodId)
        .then(products => {
            const product = products[0]
            if(!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product', 
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log('error:', err))
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImageUrl = req.body.imageUrl
    const updatedDesc = req.body.description
    Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDesc;
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT!!!');
            res.redirect('/admin/products')
        })
        .catch(err => console.log('error: ', err))
}

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
    // Product.findAll()
    .then(products => {
        res.render('admin/products', { 
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products',
        })
    }).catch(err => {
        console.log(err)
    })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy()
        })
        .then(result => {
            console.log('DELETED PRODUCT')
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log('error: ', err)
        })
} */