const bcrypt=require('bcrypt');
const Users=require('../models/userModel');
const Followers=require('../models/followerModel');

const userLogin=async(req,res)=>{
    const data=req.body;
    const foundData=await Users.findOne({email:data.email});
    if(!foundData){
        res.status(404).json({
            msg: "Account Not found",
        });
        return ;
    }
    if(foundData){
        const isCorrectPassword=await bcrypt.compare(data.password,foundData.password);
        if(!isCorrectPassword){
            res.status(401).json({
                errors:{
                    body: "Incorrect Password",
                },
            });
            return ;
        }
        console.log(foundData);
        const dataWithToken=await foundData.toUserResponse();
        // console.log(dataWithToken)
        res.cookie('authToken',dataWithToken.accessToken,{
            httpOnly:false,
            secure:false,
            sameSite:"lax",
            maxAge: 24*60*60*1000
        });
        // res.cookie('authToken',)
        // flag=true;
        res.status(201).json(dataWithToken);
    }
    else{
        res.status(422).json({
            errors:{
                body: "Unable to Login"
            }
        });
    }  
}
const userRegister=async(req,res)=>{
    try{
        const data=req.body;
        if(!data || !data.name || !data.email || !data.password){
            res.status(200).json({"msg":"Every field is required"});
        }
        //hashing a password
        const findEmail=await Users.findOne({email:data.email});
        if(findEmail){
            console.log("Already Registered");
            throw new Error("Already registered");
        }
        const hashedPassword=await bcrypt.hash(data.password,10);
        
        const temp={
            name:data.name,
            email:data.email,
            password:hashedPassword
        }
        
        const insertedData=await Users.create(temp);
        const dataWithToken=insertedData.toUserResponse();
        console.log(dataWithToken);
        res.status(200).json(dataWithToken);
    }
    catch(err){
        res.status(409).json({'msg':"Already registered"})
    }
}   
const getCurrentUser=async(req,res)=>{
    const _id=req.params.id;
    try{
        const user=await Users.findById({_id});
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        res.status(200).json(user.toUserResponse());
    }
    catch(err){
        console.error(err);
        res.status(400).json("Not found");
    }
}
const ignore=(req,res)=>{
    return res.status(200).json({message:"Authentication successful"});
}
const updateUserData=async(req,res)=>{
    const data=req.body;
    console.log(data);
    const {email,name,oldPassword,newPassword}=data;
    const foundData=await Users.findOne({email});
    // console.log(foundData);
    const isCorrectPassword=await bcrypt.compare(oldPassword,foundData.password);
    if(!isCorrectPassword){
        res.status(401).json({
            errors:{
                body: "Incorrect Password",
            },
        });
        return ;
    }
    const hashedPassword=await bcrypt.hash(newPassword,10);
    const updatedData=await Users.findOneAndUpdate({email},{name:name,password:hashedPassword},{
        new:true
    });
    console.log(updatedData);
    res.status(200).json({data:updatedData})
}
const follow=async(req,res)=>{
    const {to_follow_id}=req.body;
    // const adminEmail=req.email;
    try{
        const adminData=await Users.findOne({email:req.email});
        // console.log(following_id);
        // if (adminData._id.toString() === to_follow_id) {
        //     return res.status(400).json({ error: "Cannot follow yourself" });
        // }
        // console.log(adminData._id);
        // console.log(adminData)
        const response =await Followers.create({follower_id:adminData._id,following_id:to_follow_id})
        // console.log(response);
        await Users.findByIdAndUpdate(adminData._id, {
            $inc: { following: 1 }
        });
        await Users.findByIdAndUpdate(to_follow_id, {
            $inc: { followers: 1 }
        });
        res.status(200).json(response);
    }
    catch(err){
        console.log("Failed to Follow ",err);
        res.status(420).json(err);
    }
}
const unFollow=async(req,res)=>{
    const {following_id}=req.body;
    
    try{
        const adminData=await Users.findOne({email:req.email}).select('_id');
        console.log(adminData);
        // console.log(following_id);
        // console.log(adminData._id);
        // console.log(adminData)
        const response =await Followers.findOneAndDelete({follower_id:adminData._id,following_id:following_id})
        // console.log(response);
        await Users.findByIdAndUpdate(adminData._id, {
            $inc: { following: -1 }
        });
        await Users.findByIdAndUpdate(following_id, {
            $inc: { followers: -1 }
        });
        res.status(200).json(response);
    }
    catch(err){
        console.log("Failed to UnFollow ",err);
        res.status(400).json(err);
    }
}
const followers=async(req,res)=>{
    try{
        // console.log(req.userId);
        // console.log(req.email);
        const data=await Users.findOne({email:req.email});
        // console.log(data._id);
        const followers_data=await Followers.find({followering_id:data._id});
        return res.status(200).send(followers_data);
    }
    catch(error){
        console.log("Failed to Follow ",err)
        res.status(420).json(err);
    }
    
}
const following=async(req,res)=>{
    try{
        const admin=await Users.findOne({email:req.email}).select('_id');
        const following=await Followers.find({follower_id:admin._id}).select("following_id -_id");
        res.status(200).json(following);
    }
    catch(err){
        console.log("Failed to fetch who are following",err);
        res.status(421).json(err);
    }
}
module.exports={userLogin,userRegister,getCurrentUser,updateUserData,ignore,follow,unFollow,followers,following};