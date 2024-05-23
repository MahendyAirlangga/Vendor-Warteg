import express, { Request, Response, NextFunction } from 'express';
const router = express.Router()
import { get30MinFoods, getFoodTersedia, getTopWarteg } from './../controllers/shoppingcontroller';

router.get('/warteg-food/:_id',getFoodTersedia)
router.get('/top-warteg',getTopWarteg)
router.get('/food-in-30min/:_id',get30MinFoods)

export { router as shoppingroutes }