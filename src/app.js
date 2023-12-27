import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

//Basic express setup...
//to allow cors 
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))
//to get the json file
app.use(express.json({limit:"16kb"}));

//encode the url urlencoded is used 
app.use(express.urlencoded({extended:true,limit:"16kb"}))

//use to store..
app.use(express.static("public"));

//to perform crud operation..
app.use(cookieParser());
export { app };