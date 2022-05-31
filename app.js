const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect





const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user
    //         next()
    //     })
    //     .catch(err => console.log('error: ', err))
    next()
})

app.use('/admin', adminRoutes);
// app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
})



//Sequelize code
/* const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cartItem')
const Order = require('./models/order')
const OrderItem = require('./models/orderItem') */

/* Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem})
Product.belongsToMany(Cart, { through: CartItem})
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem})



//sync({force: true})
sequelize.sync()
    .then(result => {
        return User.findByPk(1)
        // console.log('result: ', result)
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Test', email: 'test@test.com'})
        }
        return user
    })
    .then(user => {
        // console.log(user);
        return user.createCart();
      })
    .catch(err => {
        // console.log('error: ', err)
}) */


//mySQL db
//const db = require('./util/database')

/* const expressHbs = require('express-handlebars'); */


/* app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'})); */