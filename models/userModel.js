const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    followers:{
        type:Number,
        default:0
    },
    following:{
        type:Number,
        default:0
    }
});
schema.methods.generateAccessToken=function(){
    const accessToken=jwt.sign(
        {
            user:{
                name:this.name,
                email:this.email,
            } 
        },
        process.env.ACCESS_TOKEN,
        {expiresIn:'3h'}
    )
    return accessToken;
}

schema.methods.toUserResponse=function(){
    return {
        name:this.name,
        accessToken:this.generateAccessToken(),
        email:this.email,
        followers:this.followers,
        following:this.following,
        _id:this._id
    }
}

schema.methods.toProfileJSON=function(){
    return {
        username:this.name,
        bio:this.bio,
        image:this.image,
        following:10
    }
}
const model=mongoose.model('users',schema);

module.exports=model;