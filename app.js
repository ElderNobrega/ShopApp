const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')


const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log('error: ', err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
User.hasMany(Product)

//sync({force: true})
sequelize.sync()
    .then(result => {
        return User.findByPk(1)
        // console.log('result: ', result)
    })
    .then(User => {
        if (!User) {
            return User.create({ name: 'Test', email: 'test@test.com'})
        }
        return User
    })
    .catch(err => {
        // console.log('error: ', err)
})

app.listen(3000);




//mySQL db
//const db = require('./util/database')

/* const expressHbs = require('express-handlebars'); */


/* app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'})); */