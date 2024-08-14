//require ('dotenv').config({path:'./env'})
import dotenv from 'dotenv'
import express from 'express'
import connectDb from './db/index.js';
const app = express();
//load environment
dotenv.config({
path:'./env'
});

connectDb()
.then(() => {
    const port = process.env.PORT || 3600;
    // Start the server only after the database connection is successful
    app.listen(port, () => {
      console.log(`App is running on Port ${port}`);
    });
  })
.catch((err)=>{
console.log("error occured while connection",err);
process.exit(1);
})

export default app;








// import express from 'express'
// (async ()=>{
//     try {
//    await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)   
//    application.on("error",(error)=>{
//     console.log("error",error);
//     throw error;
// })
//     app.listen(process.env.PORT,()=>{
// console.log(`port is listening on ${process.env.PORT}`)
//     })
   
      
//     } catch (error) {
//       console.error("ERROR",error) ;
//       throw error 
//     }
// })()