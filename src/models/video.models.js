import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        userName:{
            type:String, //cloudinary url
            required:true,
        },
        thumbnail:{
            type:String, //cloudinary url
            required:true,
        },
        title:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            index:true,
            
        },
        duration:{
            type:Number, 
            required:true,
        },
        description:{
            type:String,
            required:true,
            
        },

        views:{
            type:String, 
            default:0,
        },
        isPublished:{
            type:Boolean,
            required:true,
            default:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },



    },{timestamps:true}
)
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",videoSchema)