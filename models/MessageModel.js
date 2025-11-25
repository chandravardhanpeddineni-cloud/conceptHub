const mongoose=require('mongoose');
const messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    text:{
        type:String,
        required:true
    }
},{
    timestamps:true
});
const MessageModel=mongoose.model('messages',messageSchema)
module.exports=MessageModel;