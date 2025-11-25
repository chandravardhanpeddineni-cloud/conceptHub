const Articles=require('../models/articleModel');
const Users=require('../models/userModel');
const like=async(req,res)=>{
    try{
        const {article_id}=req.body;
        const email=req.email;
        const user=await Users.findOne({email}).select('_id');

        // console.log(user)
        console.log(user?._id);
        console.log("Check post 1");
        const article=await Articles.findById({_id:article_id});
        if (!user) return res.status(404).json({ error: "User not found" });
        if (!article) return res.status(404).json({ error: "Article not found" });
        if (!article.likes?.some(id => id.toString() === user._id.toString())) {
            article.likes.push(user._id);
        }
        console.log(article?.likes)
        await article.save()
        console.log(article);
        console.log("Liked Successfully 2");
        res.status(200).json(article);
    }
    catch(error){
        console.log(error);
        res.status(401).json({"error":error})
    }
    
}
module.exports={like};