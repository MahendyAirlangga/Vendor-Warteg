export const GenerateOTP = () => {
    const otp = Math.floor(100000000 + Math.random() * 900000000);

    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));


    
    return {otp, expiry};
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
    // //belum
    // const accountSid = 'AC6';
    // const authToken = '';
    // const client = require('twilio')(accountSid, authToken);

    // const data = {
    //                 body: 'OTP anda '+otp,
    //                 from: '+87703942789',
    //                 to: toPhoneNumber
    // };

    // console.log(data);

    // const response = await client.messages.create(data);

    // return response;
}