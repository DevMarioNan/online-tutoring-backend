const {PrismaClient} = require('@prisma/client');
const { generateOTP,sendOTPSMS } = require('../utils/otpUtils');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const requestOTP =  async(userId,phone,type)=>{
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp,10);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    let user = await prisma.user.findUnique({where:{id:userId}});

    if(!user){
        return { message: "Couldn't find user."}
    }else{
        await prisma.otp.create({data:{
            type,
            otp: hashedOtp,
            otpExpiresAt,
            userId: user.id
        }});
    }

    await sendOTPSMS(phone,otp);

    return {message: "OTP sent succefully!"}
}


const verifyOTP = async (userId,otp,type)=>{
    const latestOtp = await prisma.otp.findFirst({where:{
        userId: userId,
        type,
        used: false
    },
    orderBy:{
        created_at: 'desc'
    }
});

    if(!latestOtp){
        return {message: "OTP not found"}
    }

    if(latestOtp.otpExpiresAt < new Date()){
        return {message: "Expired OTP"}
    }

    const isOtpValid = await bcrypt.compare(otp,latestOtp.otp);
    if(!isOtpValid){
        return {message: "Invalid OTP"}
    }

    await prisma.otp.update({where:{id:latestOtp.id},data:{used: true}});

    switch(type){
        case 'AUTH':
            await prisma.user.update({where:{id:userId},data:{isVerified: true}});
            break;
        default:
            break;
    }

    

    return true;
}

module.exports = {requestOTP,verifyOTP}