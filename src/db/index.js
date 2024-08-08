import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
const connectDb = async () =>{
    try {
  const connectionInstance = await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)    
  console.log(`\n connenction connected!! ${connectionInstance.connection.host}`)
  //connectionInstance.connection.host rah nhhii bhtgega
    } catch (error) {
       console.log(error,"connection failed") 
       process.exit(1)  //this is in node js 
    }
}
export default connectDb