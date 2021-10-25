const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //here we are looking for a user with the id equal to decoded id and a token value equal to the token value still stored in their array (if they log out the token is no longer there)
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        if(!user){
            throw new Error()
        }
        //pulling the individual token so that it can specifically be removed (this way if you log off on your phone then you don't log off on your computer if logged in on both)
        req.token = token
        req.user = user
        next()
    }
    catch(e){
        res.status(401).send({error:'Please authenticate'})
    }
}

module.exports = auth