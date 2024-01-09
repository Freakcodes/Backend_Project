import { asyncHandler } from "../../utils/asyncHandler.js";

const registerUser=asyncHandler(async(req,res)=>{
    res.status(200).json({
        message:"Fuck yeah it is working"
    })
})


export {registerUser};