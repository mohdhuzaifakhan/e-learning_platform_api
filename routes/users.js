var express = require('express');
const User = require('../models/user');
const {registerUser, loginUser,updateProfile, getUser,updateProfilePicture} = require('../controller/user')
var router = express.Router();
const localStrategy = require('passport-local');
const passport = require('passport');
passport.use(new localStrategy(User.authenticate()));
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

/* create users listing. */
router.get('/register',registerUser);

/* get user listing. */
router.get('/login',passport.authenticate('local', {
    failureRedirect: '/users/check-login',
    successRedirect: '/'
}),loginUser);
router.get('/check-login',)

router.get('/profile',isLoggedIn,function(req,res){
  res.send("Welcome to profile")
})

router.get('/profile/:_id',getUser)

//update profile by id
router.put('/profile/:_id',updateProfile)
router.put('/profile_pic/:id',upload.single('file'),updateProfilePicture)

router.get('/logout', (req, res,next) => {
  req.logout(function(err){
    if(!err){
        console.log('logged out');
        res.redirect('/')
    }else{
        console.log(err);
    }
  });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/')

}

module.exports = router;
