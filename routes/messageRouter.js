const express =require("express");
const verifyJWT= require("../middleware/verifyJWT");
const { getMessages } = require("../controllers/messageController");
const router = express.Router();
router.get('/:userId',verifyJWT,getMessages);
module.exports=router;