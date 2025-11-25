const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/commentController");
const verifyJWT = require("../middleware/verifyJWT");
const commentModelBind=require('../middleware/commentData')
// const commentData=require('../middleware/commentData');
// console.log(commentData)
const arr=[verifyJWT,commentModelBind];
commentRouter.post("/addcomment/:slug",verifyJWT, commentController.addComment);
commentRouter.get("/getcomments/:slug", commentController.getComments);
commentRouter.delete("/deletecomment/:slug",arr, commentController.deleteComment);
module.exports = commentRouter;
