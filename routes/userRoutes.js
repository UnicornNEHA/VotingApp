const express =  require('express');
const router = express.Router();
const User = require('./../models/user');
const { jwtAuthMiddleware, generateToken} = require('./../jwt');


router.post('/signup', async (req,res) =>{
    try{
    const data = req.body ;
    const newUser = new User(data);  
    const response = await newUser.save();
    console.log('data saved');

    const payload ={
        id: response.id,
    }
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is:", token);
    res.status(200).json({response: response, token: token});
}
catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
}
})


router.post('/login' , async (req,res) =>{
    try{
        //Extract aadharNo. and password from the request body
        const {aadharCardNumber, password} = req.body;

        //Find the user by AadharNo
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});

        //If user doesn't exist or password doesn't match return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Internal UserName or Password'});
        }

        //Generate Token
        const payload = {
            id: user.id, // Fixed from response.id to user.id
        }
        
        const token=generateToken(payload);

        //Return token as response
        res.json({token})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
    });

    //Profile Route
    router.get('/profile', jwtAuthMiddleware , async(req,res)=>{
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }
   
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

//Password
    router.put('/profile/password', async(req,res)=>{
        try{
            const userId = req.user.id;  //Extract id by token
            const {currentPassword, newPassword} = req.body;  //Extract the current and new passwrod from request body
            
            //Find the user by UserId
            const user = await User.findById(userId);

            //If password doesnot match,return error
            if(!(await user.comparePassword(currentPassword))){
                return res.status(401).json({error: 'Invalid UserName or Password'});
            }

            //Update the user's password
            user.password =  newPassword;
            await user.save();

            console.log("Password  Updated");
            res.status(200).json({message: "Password updated"});
        }
        catch(err){
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    })

module.exports = router;
