if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport') //
const flash = require('express-flash')
const session = require('express-session') //
const methodOverride = require('method-override')

const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)


////

const port = 3000;

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '95Paradise',
  database: 'socka',
  port: '8000'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});
global.db = db;


app.set('port', process.env.port || port);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));



const {
  mainPage,
  registerPage,
  registerRender,
  loginPage,
  deleteRender,
  logoutRender
} = require('./modules.js');

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({
  extended: false
}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize()) //
app.use(passport.session()) //
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, mainPage)

app.get('/login', checkNotAuthenticated, loginPage)
//autoryzacja użytkownika
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, registerPage)

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })

    let name = req.body.name;
    let email = req.body.email;
    let password = hashedPassword;

    console.log(password);

    let query = "INSERT INTO `tt` (email,name,password) VALUES ('" + email + "','" + name + "','" + password + "')";

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      //res.redirect('/');
    });

    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', deleteRender)

/////////
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}



app.listen(port)