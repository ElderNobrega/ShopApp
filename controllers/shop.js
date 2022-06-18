const Product = require('../models/product')
const Order = require('../models/order')
const User = require('../models/user')


exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', { 
                prods: products, 
                pageTitle: 'All Products', 
                path: '/products',
            })
        }).catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
    })
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product, 
                pageTitle: product.title, 
                path: '/products',
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
    
    // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', { 
                prods: products, 
                pageTitle: 'Shop', 
                path: '/',
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items
            res.render('shop/cart', {
                pageTitle: 'Your Cart', 
                path: '/cart',
                products: products,
            }) 
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}
    /* Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = []
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty})
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Your Cart', 
                path: '/cart',
                products: cartProducts
            })
        })
    }) */

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => res.redirect('/cart'))
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

    //sequelize code
    /* let fetchedCart;
    let newQuantity = 1
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts({ where: {id: prodId}})
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0]
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity
                newQuantity = oldQuantity + 1
                return product
            }
            return Product.findByPk(prodId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity}})
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => console.log('error: ', err)) */
    /* const prodId = req.body.productId
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price)
    })
    res.redirect('/cart') */
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user.removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map( itm => {
                return { quantity: itm.quantity, product: { ...itm.productId._doc }}
            })
            console.log('order: ', products)
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            })
            console.log('order: ', order)
            return order.save()
        })
        .then(result => {
            return req.user.clearCart()
        })
        .then(() => { 
            res.redirect('/orders') 
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders,
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}