const userRouter=require('express').Router();
const userController=require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT');
//users logic
userRouter.post('/users/register',userController.userRegister);
userRouter.post('/users/login',userController.userLogin);
userRouter.get('/user/:id', userController.getCurrentUser);
userRouter.get('/users/user',verifyJWT, userController.ignore);
userRouter.put('/users/update',userController.updateUserData);
userRouter.get('/users/isauthenticated',verifyJWT,userController.ignore);
//followers logic
userRouter.post('/users/follow',verifyJWT,userController.follow);
userRouter.post('/users/unfollow',verifyJWT,userController.unFollow);
userRouter.get('/users/followers',verifyJWT,userController.followers);
userRouter.get('/users/following',verifyJWT,userController.following);

module.exports=userRouter;