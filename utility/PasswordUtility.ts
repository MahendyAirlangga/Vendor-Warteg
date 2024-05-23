import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { APP_SECRET } from '../config';
import { AuthPayload, VendorPayload } from '../dto';


export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async (password: string,salt: string) => {
    return await bcrypt.hash(password, salt);
}

//sebelum diganti
// export const GenerateSign = (payload: VendorPayload) => {
//     return jwt.sign(payload, APP_SECRET, {expiresIn: '1d'});
// }

//setelah diganti
export const GenerateSign = (payload: AuthPayload) => {
    return jwt.sign(payload, APP_SECRET, {expiresIn: '1d'});
}



export const ValidatePassword = async (enterpasswd: string, savedpasswd: string, salt: string) => {
    return await GeneratePassword(enterpasswd, salt) === savedpasswd;
}

export const ValidateSign = async (req: Request) => {
    const sign = req.get('Authorization');

    console.log(sign);

    if(sign){
        const payload = await jwt.verify(sign, APP_SECRET) as AuthPayload;

        req.user = payload;
        return true;
    }
    return false;
}