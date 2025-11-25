const allowedOrigins=['http://localhost:5173','https://bloggingverse.netlify.app','http://3.226.245.59'];

const corsOptions={
    origin: function(origin,callback){
        // console.log(origin);
        if(allowedOrigins.indexOf(origin)!==-1 || !origin){
            callback(null,true);
        }
        else{
            callback(new Error('Not allowed by CORS'));
        }
    } ,
    methods:'GET,POST,PUT,DELETE',
    credentials:true,
    optionsSuccessStatus:200
}
module.exports=corsOptions;