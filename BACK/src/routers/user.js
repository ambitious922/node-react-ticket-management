const express = require('express');
const router =new express.Router();
const User = require('../models/user');
const auth = require('../middleware/authentication');
const { sendWelcomeEmail } = require('../emails/account');
const { sendCancellationEmail } = require('../emails/account');
const bcrypt = require('bcryptjs');
//here we are asking for the http POST of users (important to note it is a post, not a GET). Postman can send this through in absence of a real site
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

//validating the login. The dude says its better to make a reusable function for this, we made findbycredentials. I would have whacked the bcrypt in here. Whatever
router.post('/users/login', async (req,res) =>{
    console.log("loggin in");
    var now = new Date();
    var epochToday = (Math.floor(((now) / 8.64e7) - 150.604166666));
    try{
        const loggedUser = await User.findByCredentials(req.body.email,req.body.password);
        const resetDays = loggedUser.resetDays;
        if((epochToday-resetDays)<30){
            try{
                //generateAuthToken also a bespoke method
                const token = await loggedUser.generateAuthToken()
                //now we send back the logged users details as well as an authentication tokent from the generateAuthToken method in the user.js in models
                res.send({loggedUser, token})
            }
            catch(e){
                //not sending back the e for password errors on purpose cos of hackers.
                console.log(e)
                res.status(400).send()
            }
        }
        else if((epochToday-resetDays)>29){
            //sending a 204 here, technically the process succeeded, but they gotta update their password
            res.status(204).send()
        }
        else{
            //Always just a generic error for passwords cos hackers use the error codes
            console.log("dam")
            res.status(400).send()
        }
    }
    catch(e){
        console.log(e)
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !==req.token  
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)    
    }
})

router.post('/users/logoutAll', auth, async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }
    catch(e){
        res.status(500).send(e)    
    }
})



//auth function running before the get users function
router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
})
//if you want to get whatever they sent in the HTTP request you do : then the name of the thing that it will be (i.e. the variable name you want to use in your function)
    //remember that if there is no user it will still be a success, gotta add code for that
    //nb mongoose automatically converts object ids into string ids so dont have to do the thing like with mongodb


router.patch('/users/me', auth, async(req,res)=>{
    //here trying to set up an error if they send something which does not exist in the database
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try{
        //word on the street is the findbyid method bypasses mongoose, which means that middleware also doesnt work (dangerous for passwords), gotta use the mongoose way instead
        // const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{ new: true, runValidators: true})
        //instead
        const updatedUser = req.user
        //can't use the little dots here to explicitly say what we are referring to because we don't know what value they are updating, instead you can just use fancy brackets to be variable
        updates.forEach((update)=>updatedUser[update] = req.body[update])

        await updatedUser.save()
        res.send(updatedUser)
    }
    catch(e){
        return res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req,res) =>{
    try{
        // //you can find out which user it is here because of the auth function identifying the user by the token
        sendCancellationEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    }
    catch(e){
        return res.status(500).send(e)
    }
})

router.post('/users/updatepassword', auth, async (req,res) =>{
    const updatedUser = new User({
        //this is an object which was the req.body with the user details
        ...req.body,
    })
    var adminRights = Boolean;
    adminRights = req.user.admin;
        //first check they are a user with admin rights
        if(adminRights){
            try{
                //first gotta re-bcrypt the password we send over in the update field
                var encryptedPassword = await bcrypt.hash(req.body.password,8);
                //send an update request
                var newUser = await User.findOneAndUpdate({email: req.body.email}, {password: encryptedPassword}, {new: true});
                //holy shit never send a 200 back cos it goes nuts about reupdating headers...
                res.send(newUser);
            }
            catch(e){
                return res.status(500).send(e);
            }
        }
        else{
            //get outta here, you aren't an admin
            return res.status(403);
        }
})

// accepts email, oldPassword, newPassword
router.post('/users/forcedPasswordUpdate', async (req,res) =>{
    const updatedUser = new User({
        //this is an object which was the req.body with the user details
        ...req.body,
    })
    var token;
    try{
        const loggedUser = await User.findByCredentials(req.body.email,req.body.password);
        //generateAuthToken also a bespoke method
        token = await loggedUser.generateAuthToken()
        //first check they exist, if it comes back with a resetDays number then we have a hit
        if(loggedUser.resetDays>0){
            try{
                var now = new Date();
                var epochToday = (Math.floor(((now) / 8.64e7) - 150.604166666))
                //first gotta re-bcrypt the password we send over in the update field
                var encryptedPassword = await bcrypt.hash(req.body.newPassword,8);
                //send an update request
                const newUser = await User.findOneAndUpdate({email: req.body.email}, {password: encryptedPassword, resetDays: epochToday}, {new: true});
                //holy shit never send a 200 back cos it goes nuts about reupdating headers...
                res.send({newUser, token});
            }
            catch(e){
                return res.status(500).send(e);
            }
        }
        else{
            //get outta here, your username or password was crap
            res.status(400).send();
        }
    }
    catch(e){
        //not sending back the e for password errors on purpose cos of hackers.
        res.status(400).send();
    }
})

module.exports = router