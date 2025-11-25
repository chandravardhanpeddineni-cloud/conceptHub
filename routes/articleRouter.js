const articleController = require('../controllers/articleController');
const { like } = require('../controllers/likeController');
const verifyJWT = require('../middleware/verifyJWT');

const articleRouter=require('express').Router();

articleRouter.post('/add',verifyJWT,articleController.addArticle);
articleRouter.get('/posts',articleController.getPosts);
articleRouter.post('/deletepost',verifyJWT,articleController.deletePost);
articleRouter.get('/search/:keyword',articleController.searchPosts);
// likes
articleRouter.post('/like',verifyJWT,like);
module.exports=articleRouter;
