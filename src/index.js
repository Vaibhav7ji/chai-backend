//require ('dotenv').config({path:'./env'})
import dotenv from 'dotenv'

import connectDb from './db/index.js';
dotenv.config({
path:'./env'
})

connectDb()










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