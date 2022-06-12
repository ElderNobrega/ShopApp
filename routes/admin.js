const express = require('express');
const path = require('path');
const router = express.Router();
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/isAuth')


// /admin/add-product => get
router.get('/add-product', isAuth, adminController.getAddProduct)

// /admin/add-product => get
router.get('/products', isAuth, adminController.getProducts)

// /admin/add-product => post
router.post('/add-product', isAuth, adminController.postAddProduct)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product', isAuth, adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)


module.exports = router
