import express, {Request, Response, NextFunction} from "express";
import { CustomerSignIn, CustomerSignUp, VerifOTP } from "../controllers/CustomerController";
import { Authenticate } from "../middlewares";

const router = express.Router();
router.post('/signup', CustomerSignUp);
router.post('/signin', CustomerSignIn);
router.use(Authenticate);
router.patch('/verifotp', VerifOTP);
export { router as CustomerRoute }