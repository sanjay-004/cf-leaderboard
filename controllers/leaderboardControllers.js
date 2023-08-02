const asyncHandler = require("express-async-handler");
const user = require("../models/userModel");
const https = require('https');
const axios = require('axios');

async function getResponse(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

const getLeaderboard = asyncHandler (async (req, res) => {
    const leaderboard = await user.find({}).sort(`-rating`);
    res.status(200).json(leaderboard);
});

const postUser = asyncHandler (async (req, res) => {
    const {username} = req.body;
    if(!username){
        res.status(400);
        throw new error("username is mandatory!");
    }
    const existingUser = await user.findOne({username});
    if(existingUser){
        res.status(400).json({msg : `username already exists`});
    }
    const base = "https://codeforces.com/api/user.info?handles=";
    const url=base.concat(username);
    const response = await getResponse(url);
    console.log(response);
    if(response.status=="FAILED"){
        res.status(400).json({msg : `given username does not exist on codeforces!`});
    }
    const curruser = await user.create({
        username : username,
        rating : response.result[0].rating,
        rank : response.result[0].rank
    });
    //res.status(201).json({msg : `${username} added to leaderboard`});
    res.status(201).json(curruser);
    return;
});

const updUser = asyncHandler (async (req, res) => {
    const reqUser = await user.findById(req.params.id);
    if(!reqUser){
        res.status(404);
        throw new Error("User not found");
    }
    const username=reqUser.username;
    const base = "https://codeforces.com/api/user.info?handles=";
    const url=base.concat(username);
    const response = await getResponse(url);
    const newRating = response.result[0].rating;
    const updatedUser = await user.findByIdAndUpdate({
        _id : req.params.id,
        username : username,
        rating : newRating
    })
    res.status(200).json({msg : `updated rating for ${username}`});
});

const delUser = asyncHandler (async (req, res) => {
    const reqUser = await user.findById(req.params.id);
    const username = reqUser.username;
    if(!reqUser){
        res.status(404);
        throw new Error("User not found");
    }
    await user.deleteOne({ 
        _id : req.params.id 
    });
    res.status(200).json({msg : `deleted ${username} from lb`});
});

const delAll = asyncHandler (async (req,res) => {
    await user.deleteMany({});
    res.status(200).json({msg : `deleted entire leaderboard`});
})

module.exports = {
    getLeaderboard,
    postUser,
    updUser,
    delUser,
    delAll
};
