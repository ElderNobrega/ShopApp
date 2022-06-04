const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id
    }

    save() {
        const db = getDb()
        db.collection('users').insertOne(this)
            // .then()
            // .catch(err => console.log('error: ', err))
    }

    addToCart(product) {
        // const cartProduct = this.cart.items.findIndex(cartProd => cartProd._id === product._id)
        const updatedCart = { items: [{ ...product, quantity: 1}]}
        const db = getDb()
        return db.collection('users').updateOne( { _id: new ObjectId(this._id) }, { set: { cart: updatedCart }})
    }

    static findById(userId) {
        const db = getDb()
        return db.collection('users').findOne({ _id: new ObjectId(userId)})
            .then(user => {
                console.log('user: ', user)
                return user
            })
            .catch(err => console.log('error: ', err))
    }
}

module.exports = User


//Sequelize code
/* const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});


module.exports = User; */