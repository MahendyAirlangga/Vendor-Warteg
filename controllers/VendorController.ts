import { Request, Response, NextFunction, request} from 'express';
import { VendorLoginInput, VendorPayload, EditVendorInputs, EditVendorService, CreateFoodInput, ImageFoodUpdate, findIdString} from '../dto';
import { FindVendor } from './AdminController';
import { GenerateSign } from '../utility';
import { Vendor, VendorDoc } from '../models/Vendor';
import { Food, FoodDoc } from '../models/Food';
import mongoose from "mongoose";


export const VendorLogin =async (req:Request, res:Response, next:NextFunction) =>{
    const { email, password } = <VendorLoginInput> req.body;

    const vendorExist = await FindVendor('', email);

    if(vendorExist !==null){
        let vendor;
        if(Array.isArray(vendorExist)) {
            vendor = vendorExist[0];
        } else {
            vendor = vendorExist;
        }

        const payload: VendorPayload = {
            _id: vendor._id,
            name: vendor.name,
            foodType: vendor.foodType,
            email: email
        };
        const token = GenerateSign(payload);
        return res.json(token)
    } else {

    return res.json({"message" : "Login Gagal!!"})
    }
}
export const GetVendorprofile = async (req:Request, res:Response, next:NextFunction) => {
    const user = req.user;

    if(user){
        const vendor = await FindVendor(user._id);

        return res.json(vendor);
    } 
    else{
        return res.json({"message":"vendor not found"});
    }       
}

export const UpdateVendorProfile = async (req:Request, res:Response, next:NextFunction) => {
    const {foodType, name, address, phone } = <EditVendorInputs> req.body;
   
   const user = req.user;

   if(user){
    const vendor = await FindVendor(user._id);

        if(vendor !== null && typeof vendor === 'object'){
            const m_vendor: VendorDoc = vendor as VendorDoc;
            m_vendor.name = name;
            m_vendor.address = address;
            m_vendor.phone = phone;
            m_vendor.foodType = foodType;

            const retval = await m_vendor.save();

            return res.json(m_vendor);
        }
        else {
            return res.json(vendor);
        }

   }
   else{
    return res.json({"message":"vendor not found"});
   }
}

export const UpdateVendorService = async (req:Request, res:Response, next:NextFunction) => {
    const { serviceAvailable } = <EditVendorService> req.body;
   
    const user = req.user;
 
    if(user){
     const vendor = await FindVendor(user._id);
 
         if(vendor !== null && typeof vendor === 'object'){
             const m_vendor: VendorDoc = vendor as VendorDoc;
             m_vendor.serviceAvailable = serviceAvailable;
             
             const retval = await m_vendor.save();
 
             return res.json(m_vendor);
         }
         else {
             return res.json(vendor);
         }
 
    }
    else{
     return res.json({"message":"vendor not found"});
    }
}

export const AddFood = async(req:Request, res:Response, next:NextFunction) => {
    const user = req.user;

    if(user){
        const {name, description, category, foodType, readyTime, price} = <CreateFoodInput> req.body;
        
        const vendor = await FindVendor(user._id);

        if(vendor !== null){
            const m_vendor: VendorDoc = vendor as VendorDoc;

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            console.log(files);
            console.log(images);
            
            const menu =  await Food.create({
                vendorId: m_vendor._id,
                name : name,
                description : description,
                category : category,
                foodType : foodType,
                readyTime : readyTime,
                price : price,
                rating: 0,
                images: images
            });

            m_vendor.foods.push(menu);
            const result = await m_vendor.save();

            return res.json(result);
        }
        else{
            return res.json(vendor);
        }

    }
    else{
        return res.json({"masssage":"vendor not found"});
    }
}

export const UploadCoverImage =async (req: Request, res:Response, next:NextFunction) => {
    const user = req.user;

    if(user){
        // const { coverImage } = <EditCoverImage> req.body;

        const vendor = await FindVendor(user._id);

        if(vendor !== null && typeof vendor === 'object'){
            const m_vendor: VendorDoc = vendor as VendorDoc;

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            console.log(files);
            console.log(images);

            // m_vendor.coverImage = images;

            // const retval = await m_vendor.save();

            // return res.json(m_vendor);

            m_vendor.coverImage.push(...images);
            const result = await m_vendor.save();

            return res.json(result);
        }
        else{
            return res.json(vendor);
        }

    }
}

export const AllFood = async (req: Request, res:Response, next:NextFunction) => {
    const user = req.user;

    if(user){

        const vendor = await FindVendor(user._id);

        const m_vendor: VendorDoc = vendor as VendorDoc;

        if(!m_vendor.serviceAvailable){
            return res.json({"message": "Vendor sudah tidak aktif"});
        }
        
        const food = await Food.find({ "vendorId": m_vendor._id });

        // console.log(m_vendor);

        return res.json(food);

    }
    else{
        return res.json({"message": "User Not Found"})
    }
}

export const getVendorAndFood = async (req: Request<findIdString>, res: Response, next: NextFunction) => {

    const {_id} = req.params
    const vendorAndFood = await Vendor.aggregate([{
        $match: { _id: _id }
    }, {
        $lookup:
        {
            from: 'foods',
            localField: 'foods', // Assuming 'foods' is an array of ObjectId references
            foreignField: '_id',
            as: 'foodsData'
        }
    }])
    
    return res.json(vendorAndFood)
}

export const UpdateImageFood =async (req: Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    const user = req.user;
    
    const {foodId, hapus} = <ImageFoodUpdate> req.body;

    if(user){
        // const { coverImage } = <EditCoverImage> req.body;

        const food = await Food.findById(foodId);

        // console.log(food);

        if(food !== null && typeof food === 'object'){
            const m_food: FoodDoc = food as FoodDoc;

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            if(hapus == true){
                m_food.set({  images: [] });
                // await m_food.save();
                // console.log("hapus");
            }
            // } else {
            //     m_food.images.push(...images);
            //     await m_food.save();
            //     console.log("nambah");
            // }

            // console.log(files);
            // console.log(images);

            // m_vendor.coverImage = images;

            // const retval = await m_vendor.save();

            // return res.json(m_vendor);

            m_food.images.push(...images);
            await m_food.save();

            return res.json(m_food);
        }
        else{
            return res.json(food);
        }
    }else{
        return res.json({"message": "User tidak ditemukan"})
    }
}