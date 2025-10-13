import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export enum CartStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

export type CartDocument = mongoose.HydratedDocument<Cart>

export class Cart {
    
    @Prop({ required: true, type: mongoose.Schema.Types.Array})
    products: 
    mongoose.Types.Array<{ 
        product_id: mongoose.Types.ObjectId, 
        price: number,
        quantity: number 
    }>;

    @Prop({ required: true, min: 0 })
    total: number;

    @Prop({ enum: CartStatus, default: CartStatus.PENDING })
    status: CartStatus;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart)
