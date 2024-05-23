import {Request, Response, NextFunction} from 'express';
import { CreateCustomerInput, CustomerPayload, LoginCustomerInput } from '../dto/Customer.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { GenerateOTP, GeneratePassword, GenerateSalt, onRequestOTP, GenerateSign, ValidatePassword } from '../utility';
import {Customer, CustomerDoc} from '../models/Customer';


export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const customerInput = plainToClass(CreateCustomerInput, req.body);
    const inputError = await validate(customerInput, {validationError: {target: true}});

    if(inputError.length > 0 ){
        return res.status(400).json(inputError);
    }

    const { email, phone, password } = customerInput;
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    const {otp, expiry} = GenerateOTP();

    console.log(otp);

    const existCustomer = await FindCustomer('', email);

    if(existCustomer !== null){
        return res.json({"message": "Customer sudah ada!"});
    }

    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        firstName:'',
        lastName:'',
        address:'',
        phone:phone,
        verified:false,
        otp: otp,
        otp_expiry: expiry,
        lat:0,
        lng:0

    });

    if(result){
        await onRequestOTP(otp, phone);

        const result_pros: CustomerDoc = result as CustomerDoc;

        const signature = GenerateSign({
            _id: result_pros. _id,
            email: result_pros.email,
            verified: result_pros.verified
        });

        return res.status(201).json({signature: signature,
                                     verified: result_pros.verified,
                                    email:result_pros.email})
    }
    else{
        return res.status(400).json({message:"Sign up gagal"});
    }
    
}

export const CustomerSignIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <LoginCustomerInput> req.body;

    const customerExist = await FindCustomer('', email);

    if(customerExist !== null){
        const m_customer: CustomerDoc = customerExist as CustomerDoc
        const validation = await ValidatePassword(password, m_customer.password, m_customer.salt);
        console.log(validation)
        if(validation){
            const payload: CustomerPayload = {
                _id: m_customer._id,
                verified: m_customer.verified,
                email: email
            };

            const token = GenerateSign(payload);
            return res.json({signature: token, verified: m_customer.verified, email: m_customer.email})
        }else{
            return res.json({"message": "Login Gagal!!"})
        }
    }else{
        return res.json({"message": "Login Gagal!!"})
    }
}

export const VerifOTP = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const {otp} = req.body;
    const customer = req.user;

    if(customer){
        const data = await Customer.findById(customer._id);
        if(data){
            if(data.otp === otp && data.otp_expiry >= new Date()){
                data.verified = true;
                const updateData = await data.save();
                const signature = GenerateSign({
                    _id: updateData._id,
                    email: updateData.email,
                    verified: updateData.verified
                });

                return res.status(201).json({signature: signature, verified: updateData.verified, email: updateData.email});
            }
        }
    }
    return res.status(400).json({message:'Verifikasi OTP gagal'});
}

export const FindCustomer = async(id: string | undefined, email?: string) => {
    if(email){
        return await Customer.findOne({email: email});
    }
    // else{
    //     return await Vendor.findById(id);
    // }
    else if(id){
        return await Customer.findById(id);
    }
    else{
        return await Customer.find();
    }
}
