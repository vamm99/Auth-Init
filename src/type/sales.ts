import { Types } from 'mongoose';

export interface ProductInSale {
  product_id: {
    _id: Types.ObjectId;
    name: string;
    price: number;
    image_url?: string;
  } | Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface SalesResponse {
  _id: string;
  products: ProductInSale[];
  total: number;
  user_id: Types.ObjectId | string;
  payment_id?: string;
  status: string;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}
