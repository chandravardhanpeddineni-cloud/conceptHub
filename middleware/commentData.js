const Articles=require('../models/articleModel')
const mongoose=require('mongoose');
const commentModelBind=async(req,res,next)=>{
    console.log("check post 1")
        const { slug } = req.params;
        const commentId = new mongoose.Types.ObjectId(req.body.commentId);
        try{
            console.log("commentid ", commentId);
            const article = await Articles.findOne({ slug });
            if (!article) {
                return res.status(404).json({ message: "Article not found" });
            }
            req.article=article;
            req.commentId=commentId;
            next();
        }
        catch(err){
            console.error("Error: ", err);
            res.status(500).json({ message: "An error occurred", error: err.message });
        }
}
module.exports=commentModelBind;
