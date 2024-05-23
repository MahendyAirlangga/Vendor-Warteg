export interface CreateFoodInput{
    name: string;
    description: string;
    category: string;
    foodType : string;
    readyTime: number;
    price : number;
}

export interface ImageFoodUpdate{
    foodId: string;
    hapus: boolean;
}