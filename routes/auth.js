const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require ('../middleware/auth');
// const { Redirect } from 'react-router';



// @router POST api/auth
// @desc POST auth
// @access Public
router.post('/add',(req,res)=>{

   const {email,password} = req.body;

   //Simple validation
   if(!email || !password) {
    // return res.status(400).json({msg: 'Please enter all fields'});
    return res.json('Please enter all fields');
   }

     //Check exsiting user
     Users.findOne({email })
     .then(users => {
        //  if(Users) return res.status(400).json({ msg:'User already exists'});
         if(!users) return res.json("User does not exists");
     
        
        //Validate password
        bcrypt.compare(password,users.password)   //user.password is hash password comes from above(from database)
        .then(isMatch => {   //This line will check plain text password that we entered and users.password(hash password) is same or not
            if(!isMatch)  return res.json('Invalid credentials, Please enter valid password and email');
           
           
                //Create json web token
                jwt.sign(
                    { id:users.id }, 
                    //  config.get('jwtSecret'),
                    "secretkey",
                     { expiresIn:3600 },
                     (err,token) => {      //This is the way how write asynchronus
                         if(err) throw err;
                         res.json({
                             token,
                            users:{
                            id: users.id,
                            username:users.username,
                            email:users.email,
                            // password:users.password,
                            confirmpassword:users.confirmpassword
                            }
                        });
                   }
              )
        })  
        .then(() => res.json("You are loged successfuly"))
        // .then(()=> res.redirect('../client/src/components/Articles.js'));
            
    })   
});



//@route  GET  api/auth/user
// @desc Get  user data
//@access  Private

    router.get('/user',auth,(req,res) => {
    Users.findById(req.users.id)
    .select('-password')
    .then(users => res.json(users));
})

    module.exports = router;