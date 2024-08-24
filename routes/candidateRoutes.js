const express =  require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user');
const { jwtAuthMiddleware, generateToken} = require('../jwt');

const checkAdminRole = async(userId) =>{
    try{
        const user = await User.findById(userId);
        return user.role ==='admin';
    }
    catch(err){
        return false;
    }
}

//POST route to add a candidate
router.post('/',jwtAuthMiddleware, async (req,res) =>{
    try{
        const isAdmin = await checkAdminRole(req.user.id);
        if(!isAdmin){
           
            return res.status(403).json({message: 'user has not admin role'});
        }
    const data = req.body ;
    const newCandidate = new Candidate(data);  
    const response = await newCandidate.save();
    console.log('data saved');

    
    res.status(200).json({response: response});
}
catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
}
})



 

//Password
router.put('/:candidateID',jwtAuthMiddleware, async(req,res)=>{
        try{
            if(!checkAdminRole(req.user.id)){
                return res.status(404).json({message: 'user has not admin role'});
            }
            const candidateID = req.params.candidateID;  //Extract id by token
            const updateCandidateData = req.body;
           
            const response = await Candidate.findByIdAndUpdate(candidateID,updateCandidateData,{
                new: true,
                runValidators: true,
            })

            if(!response){
                return res.status(403).json({error:'Canadidate not found'});
            }
            console.log('candidate data updated');
            res.status(200).json(response);
           

            
        }
        catch(err){
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    })
    router.delete('/:candidateID',jwtAuthMiddleware,
         async(req,res)=>{
        try{
            if(!checkAdminRole(req.user.id)){
                return res.status(403).json({message: 'user has not admin role'});
            }
            const candidateID = req.params.candidateID;  //Extract id by token
            const updateCandidateData = req.body;
           
            const response = await Candidate.findByIdAndDelete(candidateID);

            if(!response){
                return res.status(403).json({error:'Canadidate not found'});
            }
            console.log('candidate deleted');
            res.status(200).json(response);
           

            
        }
        catch(err){
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    })

//let's start voting
router.get('/vote/:candidateID',jwtAuthMiddleware,async (req,res) =>{
    //no admin can vote
    //user can only vote once
    candidateID = req.params.candidateID;
    userId=req.user.id;

    try{
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            res.status(404).json({ message: 'Candidate not found'});
        }

        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({ message: 'Candidate not found'});
        }

        if(user.isVoted){
            res.status(400).json({ message: 'You have already voted'});
        }

        if(user.role=='admin'){
            res.status(403).json({ message: 'Admin is not allowed'});
        }

        //Update the candidate document to record the vote
        candidate.votes.push({user: userId});
        candidate.voteCount++;
        await candidate.save();
        
        //Update the user
        user.isVoted =  true;
        await user.save();

        res.status(200).json({ message: 'Vote recorded successfully'});
    
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

//Vote Count
router.get('/vote/count',async (req,res) => {
    try{
        //Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        //Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });
        return res.status(200).json(voteRecord);

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
