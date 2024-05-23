import express, { Request, Response, NextFunction } from "express";
import { AddFood, AllFood, UpdateImageFood, UploadCoverImage, VendorLogin, getVendorAndFood } from "../controllers";
import { Authenticate } from "../middlewares";
import { GetVendorprofile } from '../controllers';
import { UpdateVendorProfile } from "../controllers";
import { UpdateVendorService } from "../controllers";
import multer from 'multer';
import randomstring from 'randomstring';

const router = express.Router();

const imgStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./images');
    },
    filename: function(req, file, cb){
        cb(null, randomstring.generate(7)+'_'+file.originalname);
    }
});

const gambar = multer({storage: imgStorage}).array('myimages',10);

router.post('/login',VendorLogin);

export {router as VendorRoutes};
router.get('/vendor-food/:_id',getVendorAndFood)
router.use(Authenticate)
router.get('/profile',GetVendorprofile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/service', UpdateVendorService);
router.post('/food',gambar,AddFood);
router.post('/coverimage', gambar, UploadCoverImage);
router.get('/food', AllFood);
router.post('/updateimagefood', gambar, UpdateImageFood);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        message: "Hallo, route vendor"
    });
});