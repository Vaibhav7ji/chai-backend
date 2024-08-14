import mongoose,{Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
//data ko directly save na krr de uske liye password lga lete h with the help of pre hooks
const userSchema = new mongoose.Schema(
    {
userName:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true,

},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,    
},
fullName:{
    type:String,
    required:true,
    trim:true,
    index:true,
},
avatar:{
    type:String, //cloudinary url
    required:true,
    
},
coverImage:{
    type:String,
},
watchHistory:[
    {
        type:Schema.types.ObjectId,
        ref:"Video"

    }
],
password:{
    type:String,
    required:[true,"Password id required"]
},
refreshToken:{
    type:String,

}



},{
    timestamps:true
}
)
userSchema.pre("save",async function(next){
    this.password = await bcrypt.hash(this.password,10);
    next();
})
userSchema.methods.isPasswordCorrect=async function(password){
   await bcrypt.compare(password,this.password)
}
userSchema.methods.genrateAcessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName

    },
    process.env.ACCESS_TOKEN_SECRET,{
       expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)}
userSchema.methods.genrateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,

    },
    process.env.REFRESH_TOKEN_SECRET,{
       expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
export const User = mongoose.model("User",userSchema)