const mongoose = require('mongoose');

//define candidate schema
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    party: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    votes:[  //Array of objects
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt:{
                type:Date,
                default: Date.now()
            }
        }
    ],
    voteCount:{
        type: Number,
        default: 0
    },
    mobile:{
        type: String,
        
    },
    email:{
        type: String,
        unique: true
    },
    address:{
        type: String,
        required: true
    },
    aadharCardNumber:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['voter' ,'admin'],
        default: 'voter' 
    },
    isVoted:{
        type: Boolean,
        default: false
    }
    
});
const Candidate = mongoose.model('Candidate',candidateSchema);
module.exports = Candidate;
