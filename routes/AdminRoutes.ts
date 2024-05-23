import express, { Request, Response, NextFunction } from "express";
import { CreateVendor, GetVendor, GetVendorById } from "../controllers";

const router = express.Router();

router.post('/vendor', CreateVendor);
router.get('/vendors', GetVendor);
router.get('/vendor/:id', GetVendorById);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        message: "Hallo, route admin"
    });
})

export {router as AdminRoutes};



