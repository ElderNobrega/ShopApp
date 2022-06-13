const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [
            { 
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, 
                quantity: { type: Number, required: true }
            }
        ]
    }
})

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cartProd => cartProd.productId.toString() === product._id.toString())
    let newQuanity = 1
    const updatedCartItems = [...this.cart.items]

    if (cartProductIndex >= 0) {
        newQuanity = this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuanity
    } else {
        updatedCartItems.push({ productId: product._id, quantity: newQuanity })
    }
    
    const updatedCart = { items: updatedCartItems }
    this.cart = updatedCart
    return this.save()
}

userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(itm => itm.productId.toString() !== productId.toString())

    this.cart.items = updatedCartItems
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] }
    return this.save()
}

module.exports = mongoose.model('User', userSchema)


// const mongodb = require('mongodb')
// const getDb = require('../util/database').getDb

// const ObjectId = mongodb.ObjectId

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id
//     }

//     save() {
//         const db = getDb()
//         db.collection('users').insertOne(this)
//             // .then()
//             // .catch(err => console.log('error: ', err))
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cartProd => cartProd.productId.toString() === product._id.toString())
//         let newQuanity = 1
//         const updatedCartItems = [...this.cart.items]

//         if (cartProductIndex >= 0) {
//             newQuanity = this.cart.items[cartProductIndex].quantity + 1
//             updatedCartItems[cartProductIndex].quantity = newQuanity
//         } else {
//             updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuanity })
//         }
        
//         const updatedCart = { items: updatedCartItems }
//         const db = getDb()
//         return db.collection('users').updateOne( { _id: new ObjectId(this._id) }, { $set: { cart: updatedCart }})
//     }

//     getCart() {
//         const db = getDb()
//         const productIds = this.cart.items.map(itm => { return itm.productId })
//         return db.collection('products').find({ _id: { $in: productIds}}).toArray()
//             .then(products => {
//                 return products.map(prod => {
//                     return {...prod, quantity: this.cart.items.find(itm => { return itm.productId.toString() === prod._id.toString()}).quantity}
//                 })
//             })
//     }

//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(itm => itm.productId.toString() !== productId.toString())
//         const db = getDb()
//         return db.collection('users').updateOne( { _id: new ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } }})
//     }

//     addOrder() {
//         const db = getDb()
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.name,
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         })
//         .then(result => {
//             this.cart = {items: []}
//             return db.collection('users').updateOne( { _id: new ObjectId(this._id) }, { $set: { cart: { items:[] } }}) 
//         })
//     }

//     getOrders(orderId) {
//         const db = getDb()
//         return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray()
//     }

//     static findById(userId) {
//         const db = getDb()
//         return db.collection('users').findOne({ _id: new ObjectId(userId)})
//             .then(user => {
//                 console.log('user: ', user)
//                 return user
//             })
//             .catch(err => console.log('error: ', err))
//     }
// }

// module.exports = User


// //Sequelize code
// /* const Sequelize = require('sequelize')
// const sequelize = require('../util/database')

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     name: Sequelize.STRING,
//     email: Sequelize.STRING
// });


// module.exports = User; */