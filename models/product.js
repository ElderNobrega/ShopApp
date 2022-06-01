const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        const db = getDb()
        return db.collection('products').insertOne(this)
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log('error: ', err))
    }

    static fetchAll() {
        const db = getDb()
        return db.collection('products').find().toArray()
            .then(products => {
                console.log('products: ', products)
                return products
            })
            .catch(err => console.log('error: ', err))
    }

    static findById(prodId) {
        const db = getDb()
        return db.collection('products').find({ _id: new mongodb.ObjectId(prodId) }).next()
            .then(product => {
                console.log(product)
                return product
            })
    }
}


module.exports = Product



/* const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
}) */


//Sequelize code
/* const Sequelize = require('sequelize')
const sequelize = require('../util/database') */

// MySql 
/* const Cart = require('./cart')
const db = require('../util/database')

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', 
            [this.title, this.price, this.imageUrl, this.description])
    }

    static deleteById(id) {
        
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products').catch()
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = (?)', [id])
    }
} */