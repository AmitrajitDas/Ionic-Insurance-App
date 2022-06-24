const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

passport.use(new LocalStrategy({
    usernameField:'email'
},
function(email,password,done){
    User.findOne({email},function(err,user){
        if(err)
        {
            console.log('Error in finding user --> Passport')
            return done(err)
        }

        console.log(user)
        if(!user)
        {
            console.log('Invalid user')
           return done(err,false)
        }

        if(!bcrypt.compareSync(password,user.password)) 
        {
            {
                console.log('please check your credentials and log back in!')
               return done(err,false)
            }
        }

        return done(null,user)
    })

}))


passport.serializeUser(function(user,done)
{
    done(null,user.id)
})

passport.deserializeUser(function(id,done){
    User.findById({_id:id},function(err,user){
        if(err)
        {
            console.log('Error in finding user --> Passport')
            return done(err) 
        }
        return done(null,user)
    })
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
        res.locals.user = req.user
    }
    
    next()
}

module.exports = passport;