import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    _id:{type:String,required:true},
    email:{type:String,required:true},
    full_name:{type:String,required:true},
    username:{type:String,unique:true},
    bio:{type:String,default:'hey there! I am using Pingup.'},
    profile_picture:{type:String,default:''},
    cover_photo:{type:String,default:''},
    location:{type:String,default:''},
    followers:[{type:String,ref:'User'}],
    following:[{type:String,ref:'User'}],
    connections:[{type:String,ref:'User'}],


},{timestamps:true,minimize:false})

const User=mongoose.model("User",userSchema);

export default User;

// since we aare using clerk so to get the data of user from clerk we need to use clerk webhooks
// to effenciently managing the clerk webhooks scheduling and chron jon we will use ingest 

// features ->batch processing ,queueing ,backgroundjobs,scheduling