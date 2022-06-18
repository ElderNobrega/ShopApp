const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const loginRoutes = require('./routes/auth')
const errorController = require('./controllers/error')
const User = require('./models/user')
const dbConectionString = require('./util/database').dbConectionString
const mongoose = require('mongoose')
const session = require('express-session')
const mongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash');
const { throws } = require('assert');


const app = express();
const store = new mongoDBStore({
    uri: dbConectionString,
    collection: 'sessions'
})

const csrfProtection = csrf({})


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({ 
        secret: 'my secrete', 
        resave: false, 
        saveUninitialized: false, 
        store: store
    })
)

app.use(csrfProtection)

app.use(flash())

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn,
    res.locals.csrfToken = req.csrfToken(),
    next()
})

// req.user = new User().init(req.user);
app.use((req, res, next) => {
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next()
            }
            req.user = user;
            next()
        })
        .catch(err => {
            next(new Error(err))
        })
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(loginRoutes);
app.get('/500', errorController.get500)
app.use(errorController.get404);

app.use((error, req, res, next) => {
    res.status(500).render('/500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    })
    // res.redirect('/500')
})

mongoose.connect(dbConectionString)
    .then(result => {
        app.listen(3000)
    })
    .catch(err => console.log('error: ', err))

// mongoConnect(() => {

//     app.listen(3000);
// })



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