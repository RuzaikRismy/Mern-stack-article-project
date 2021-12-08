const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// @router POST api/user
// @desc POST user
// @access Public
router.post('/add',(req,res)=>{

   const {username,email,password,confirmpassword} = req.body;

   //Simple validation
   if(!username || !email || !password || !confirmpassword) {
    // return res.status(400).json({msg: 'Please enter all fields'});
    return res.json('Please enter all fields');
   }

     //Check exsiting user
     Users.findOne({email })
     .then(users => {
        //  if(Users) return res.status(400).json({ msg:'User already exists'});
         if(users) return res.json("User alredy exists");
     
        const newUser = new Users({
            // username:req.body.username,
            // email:req.body.email,
            // password:req.body.password,
            // confirmpassword: req.body.confirmpassword,

            username,
            email,
            password,
            confirmpassword
        });
        
        //Create salt & hash
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt, (err,hash)=> {
                if(err) throw err;
                newUser.password=hash;
                newUser.save()

               .then(users=> {  //Here users mean, database collection name 
                jwt.sign(
                    {id : users.id},
                    "secretkey",
                    {expiresIn: 3600},
                    (err,token) => {
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
                    })
                    }
                ) 
               })

                 .then(() => res.json("Successfully Registerd"));    //If we comment this promise,then we can see token in postman,when post user using postman
                // .catch(err=> res.status(400).res.json(`Error:${err}`));
                
            })
        })
    })   
});

    module.exports = router;