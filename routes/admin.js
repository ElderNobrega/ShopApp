const express = require('express');
const path = require('path');
const router = express.Router();
const adminController = require('../controllers/admin')


// /admin/add-product => get
router.get('/add-product', adminController.getAddProduct)

// /admin/add-product => get
router.get('/products', adminController.getProducts)

// /admin/add-product => post
router.post('/add-product', adminController.postAddProduct)

// router.get('/edit-product/:productId', adminController.getEditProduct)

// router.post('/edit-product', adminController.postEditProduct)

// router.post('/delete-product', adminController.postDeleteProduct)


module.exports = router
