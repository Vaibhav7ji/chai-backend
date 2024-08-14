import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(`\nConnection connected!! ${connectionInstance.connection.host}`);


  //connectionInstance.connection.host rah nhhii bhtgega
    } catch (error) {
      console.error("Connection failed", error);
      process.exit(1);  // Exiting the process with a failure code this is in node js
  }
};

export default connectDb;