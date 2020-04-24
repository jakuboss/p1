const fs = require('fs');

module.exports = {

    mainPage: (req, res) => {
        res.render('index.ejs', {
            name: req.user.name
        })

    },

    registerPage: (req, res) => {
        res.render('register.ejs')

    },

    registerRender: async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.push({
                id: Date.now().toString(),
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            res.redirect('/login')
        } catch {
            res.redirect('/register')
        }
    },

    loginPage: (req, res) => {
        res.render('login.ejs')
    },


    deleteRender: (req, res) => {
        req.logOut()
        res.redirect('/login')
    },

    logoutRender: (req, res) => {
        req.logOut()
        res.redirect('/login')
    }
}