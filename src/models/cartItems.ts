import { ObjectId } from "mongodb";

export interface CartItem {
    _id?: ObjectId;
    product: string;
    price: number;
    quantity: number;
}