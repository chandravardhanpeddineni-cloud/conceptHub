const Message=require('../models/MessageModel')
const getMessages=async(req,res)=>{
    try{
        const currentUserId = decoded.id;
        const otherUserId = req.params.userId;
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId },
            ],
        }).sort({ createdAt: 1 });
        res.json(messages);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"Failed to load messages"});
    }
};

module.exports={getMessages};