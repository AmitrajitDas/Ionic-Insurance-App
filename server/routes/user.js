const express = require('express')
const passport = require('passport')
const router = new express.Router()
const userController = require('../controllers/userController')

router.get('/login',userController.login)

router.post('/login/create-session',passport.authenticate(
    'local',
    {failureRedirect :'/login'},
) ,userController.postlogin)


router.post('/signup',userController.postSignup)

router.post('/verify/user',userController.verifySignup)

module.exports = router
