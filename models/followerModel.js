const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    follower_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    following_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    }
},{timestamps:true});

schema.index({follower_id:1});

schema.index({following_id:1});

schema.index({follower_id:1,following_id:1},{unique:true});

const model=mongoose.model('followers',schema);
module.exports=model;