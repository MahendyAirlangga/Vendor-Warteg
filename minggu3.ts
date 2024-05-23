import express from 'express';
import { AdminRoutes, CustomerRoute, VendorRoutes, shoppingroutes } from './routes';

import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { MONGO_URI } from './config';
import path from 'path';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/images', express.static(path.join(__dirname,'images')));

app.use('/admin', AdminRoutes);
app.use('/vendor', VendorRoutes);
app.use('/customer', CustomerRoute);
app.use(shoppingroutes);


app.listen(8000, () => {
    console.log('aplikasi aktif pada port 8000');
})

mongoose.connect(MONGO_URI).then(result => {
    console.log('DB terkoneksi');
}).catch(err => console.log('error '+err))