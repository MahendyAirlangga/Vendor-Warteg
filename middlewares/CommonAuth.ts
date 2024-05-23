import { AuthPayload } from "../dto";
import { Request, Response, NextFunction } from "express";
import { ValidateSign } from "../utility";

declare global{
    namespace Express{
        interface Request{
            user?: AuthPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await ValidateSign(req);

    if(validate){
        next();
    }
    else{
        return res.json({"message" : "Not authorized"})
    }
}