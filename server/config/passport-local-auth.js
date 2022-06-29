const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/theuser')

passport.use(new LocalStrategy({
    usernameField:'email'
},
 async function(email,password,done){
    console.log(email)
    try {
        const user = await User.findOne({where:{email:email}});
        console.log(user.dataValues,'dekho toh')
        if(!user)
        {
            console.log('Invalid user')
           return done(err,false)
        }

        if(!bcrypt.compareSync(password,user.dataValues.password)) 
        {
            {
                console.log('please check your credentials and log back in!')
               return done(err,false)
            }
        }

        return done(null,user.dataValues)
        
    } catch (error) {
        console.log('Error in finding user --> Passport')
        return done(error)
    }
}))


passport.serializeUser(function(user,done)
{
    done(null,user.email)
})

passport.deserializeUser(async function(email,done){
    try {
        const user = await User.findOne({where:{email}});
        return done(null,user)
    } catch (error) {
        if(error)
        {
            console.log('Error in finding user --> Passport')
            return done(error) 
        }
    }
})

passport.checkAuthentication = (req,res,next)=>{
    if(req.isAuthenticated())
    {
        return next()
    }
    return res.redirect('/login')
}

passport.setAuthenticatedUser = (req,res,next)=>{
    if(req.isAuthenticated())
    {
        console.log('set authenticayed user')
        res.locals.user = req.user
    }
    
    next()
}

module.exports = passport;