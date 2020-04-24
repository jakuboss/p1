const LocalStrategy = require('passport-local').Strategy //
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  //1
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, {
        message: 'No user with that email'
      })
    }

    try {
      if (await bcrypt.compare(password, user.password)) { //user.password jako odwołanie do listy (trzeba zmienic na odwołanie do serwera)
        console.log(password);
        return done(null, user) //???
      } else {
        return done(null, false, {
          message: 'Password incorrect'
        })
      }
    } catch (e) {
      return done(e)
    }
  }
  //2
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, authenticateUser))
  //3
  passport.serializeUser((user, done) => done(null, user.id))
  //4
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize