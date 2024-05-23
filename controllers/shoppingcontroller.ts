import { Request, Response, NextFunction } from 'express';
import { Vendor } from '../models/Vendor';
import { findIdString } from '../dto/Vendor.dto';
import { Food } from '../models/Food';

export const getFoodTersedia = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params
    // try {
        console.log(_id);
        
        const result = await Vendor.find({ _id, serviceAvailable: true }).sort({ rating: "descending" }).populate("foods")
        if (result.length > 0) {
            return res.status(200).json(result)
        } else {
            return res.status(400).json({ message: "Not Found or not available" })
        }
    // } catch (e) {
    //     if (typeof e === "string") {
    //         console.log(e.toUpperCase());
    //     }
    //     if (e instanceof Error) {
    //         console.log(e.message);
    //     }

    //     return res.status(400).json({ message: "Not Found or not available" })
    // }
}
export const get30MinFoods = async (req: Request<findIdString>, res: Response, next: NextFunction) => {
    const { _id } = req.params
    try {
        const result = await Food.aggregate([{ $match: { vendorId: _id, readyTime: { $lt: 30 }, } }])
        if (result.length > 0) {
            return res.status(200).json(result)
        } else {
            return res.status(400).json({ message: "Not Found or not available" })
        }

    } catch (e) {
        if (typeof e === "string") {
            console.log(e.toUpperCase());
        }
        if (e instanceof Error) {
            console.log(e.message);
        }

        return res.status(400).json({ message: "Not Found or not available" })
    }
}
export const getTopWarteg = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Vendor.aggregate([{ $sort: { rating: -1 } }]).limit(3)
        if (result.length > 0) {
            return res.status(200).json(result)
        } else {
            return res.status(400).json({ message: "Not Found or not available" })
        }

    } catch (e) {
        if (typeof e === "string") {
            console.log(e.toUpperCase());
        }
        if (e instanceof Error) {
            console.log(e.message);
        }

        return res.status(400).json({ message: "Not Found or not available" })
    }
}