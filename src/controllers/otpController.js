const otpService = require('../services/otpService');

const requestOTP = async (req,res)=>{
    try {
        const {userId,phone,type} = req.body;
        const response = await otpService.requestOTP(userId,phone,type);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to send OTP"});
    }
}

const verifyOTP = async(req,res)=>{
    try {
        const {userId,otp,type} = req.body;
        const response = await otpService.verifyOTP(userId,otp,type);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
}

module.exports = {requestOTP,verifyOTP};