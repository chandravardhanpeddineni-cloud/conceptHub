require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./models/corsOptions");
const {Server}=require('socket.io');
const cookieParser=require('cookie-parser');
// const jwt=require('jsonwebtoken');
const Users=require('./models/userModel');

// const Message=require('./models/MessageModel');

const http=require('http');
const server=http.createServer(app);
const io=new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    credentials:true
  }
});//this is circuit
const users={};

io.on("connection",(socket)=>{
  console.log("User Connected with socket_id "+socket.id);
  socket.on("register",(userId)=>{
    // const user=await Users.findById({_id:userId}).select("name -_id");
    // console.log(user);
    users[userId]={socket_id:socket.id};
    console.log("Registered user successfully with userId "+userId);
  })
  
  socket.on('sendMessage',({msg,to_id,from_id,from_name,createdAt})=>{
    console.log("we need to send this msg "+msg+" to "+to_id);
    const sender=users[from_id];
    const reciever=users[to_id];
    // console.log(socket_id);
    // console.log(name);
    if(!reciever?.socket_id){
      console.log("Receiver id is not found sorry");
    }
    socket.to(reciever?.socket_id).emit("receiveMessage",{msg,from_name,to_id:to_id,from_id:from_id,createdAt});
    // console.log("Message sent to "+reciever?.name);
  })
})

const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
const DbConnect = require("./config/dbConnect");
DbConnect();
//users
app.use("/api", require("./routes/userRouter"));
//articles
app.use("/api/articles", require("./routes/articleRouter"));
app.use("/api/articles/comments", require("./routes/commentRouter"));
app.use('/api/messages',require('./routes/messageRouter'))


mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => {
    console.log(`app is listening on ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("Error while connecting to MongoDB: ", err);
});
