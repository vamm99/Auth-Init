import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

export enum CartStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

export type CartDocument = mongoose.HydratedDocument<Cart>

@Schema({ timestamps: true })
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

}

export const CartSchema = SchemaFactory.createForClass(Cart)
