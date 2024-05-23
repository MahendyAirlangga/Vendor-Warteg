export interface CreateVendorInput{
    name: string;
    ownerName: string;
    pincode: string;
    foodType: [string];
    address : string;
    phone: string;
    email: string;
    password: string;
}

export interface VendorLoginInput{
    email:string,
    password:string
}

export interface VendorRet{
    _id: string,
    name:string,
    ownerName: string,
    foodType: [string],
    pincode: string,
    address: string,
    phone: string,
    email: string,
    password: string,
    salt: string,
    serviceAvailable: boolean,
    coverImage: [string],
    rating: number
}

export interface VendorPayload{
    _id: string,
    email: string,
    name: string,
    foodType: [string]
}

export interface EditVendorInputs{
    name: string,
    address: string,
    phone: string,
    foodType: [string];
}

export interface EditVendorService{
    serviceAvailable: boolean;
}

export interface findIdString{
    _id:string;
}