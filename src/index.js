import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path:'./env'
})

connectDB()
.then(
    ()=>{
        app.listen(process.env.PORT||8000,()=>{
            console.log(`Server is running at port :${process
            .env.PORT}`);
        })
    }
)
.catch((err)=>{
    app.on("error",(err)=>{
        console.log("Mongo DB connection failed ",err);
    })
})





//To import database their are two ways ...One using IIFE(immediately invoked function expression )in the main.js file itself...the another way around is to create the function in some DB folder and import it in the index or main file...
/*
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error",(error)=>{
            console.log("Error: ",error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })
        
    } catch (error) {
        console.error("Error: ",error);
        throw error;
    }
})()
 
*/




