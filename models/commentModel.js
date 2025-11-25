const mongoose=require('mongoose');
const {Schema}=mongoose;
const Users=require('../models/userModel');
const commentSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    body:{
        type: String,
        required:true
    },
    articleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"articles"
    }
},{timestamps:true});
commentSchema.methods.toUserCommentResponse=async function(user){
    console.log(user);
    return {
        author: user.toProfileJSON(),
        body:this.body,
        id:this.id,
        createdAt:this.createdAt,
        updatedAt:this.updatedAt
    }
}
const commentModel=mongoose.model('comments',commentSchema);
module.exports=commentModel;