const Articles = require("../models/articleModel");
const Users = require("../models/userModel");
const Comment = require("../models/commentModel");
const mongoose = require("mongoose");

const addComment = async (req, res) => {
  const { slug } = req.params;
  const article = await Articles.findOne({ slug });
  const email = req.email;
  const user = await Users.findOne({ email });
  const id = user._id;
  const articleId = article._id;
  const { body } = req.body;
  const newComment = await Comment.create({
    userId: id,
    articleId: articleId,
    body: body,
  });
  article.comments.push(newComment._id);
  await article.save();
  res
    .status(200)
    .json({ comment: await newComment.toUserCommentResponse(user) });
};
const deleteComment = async (req, res) => {
  // const { slug } = req.params;
  // const commentId = new mongoose.Types.ObjectId(req.body.commentId);
  try {
    console.log(req);
    const commentId=req.commentId;
    const article=req.article;
    // Removing commentId from article's comments array
    article.comments.remove(commentId);
    await article.save();
    // console.log("commentid is removed from article comment list");
    const removedComment = await Comment.deleteOne({ _id: commentId });
    if (removedComment.deletedCount === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Deleted comment successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
const getComments=async(req,res)=>{
  try{
    const {slug}=req.params;
    const article=await Articles.find({slug});
    // console.log(article[0].comments);

    const commentIds=article[0]?.comments;
    // console.log(commentIds);
    const validCommentIds=commentIds.map((id)=> new mongoose.Types.ObjectId(id));
    // console.log(commentIds);
    const comments=await Comment.find({_id:{$in:validCommentIds}})
    // async function commentResponse(){
    //   const newComments=comments.map(async(comment)=>{
    //     const id=comment.userId;
    //     const user=await Users.findOne({_id:id});
    //     return {...comment,username:user?.name};
    // })
    //  const output=await Promise.all(newComments);
    //  console.log(output);
    //  return output;
    // }
    // const commentsOutput=await commentResponse();
    // console.log(commentsOutput)
    // console.log(comments);
    const newComments=comments.map(async(comment)=>{
        const id=comment.userId;
        // console.log(comment);
        const user=await Users.findOne({_id:id});
        return {...comment._doc,username:user?.name}
        
    })
     const commentResponse=await Promise.all(newComments);
     console.log(commentResponse);
    
    res.status(200).json(commentResponse);
  }
  catch(err){
    console.log(err);
    res.status(401).json({msg:err});
  } 
}

module.exports = { addComment, deleteComment,getComments };