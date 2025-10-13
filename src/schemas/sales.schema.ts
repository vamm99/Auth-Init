import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type SalesDocument = mongoose.HydratedDocument<Sales>

export enum SalesStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

export class Sales {
    
    products: mongoose.Types.Array<{ 
        product_id: mongoose.Types.ObjectId, 
        price: number,
        quantity: number 
    }>;

    total: number;

    @Prop({ enum: SalesStatus, default: SalesStatus.PENDING })
    status: SalesStatus;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const SalesSchema = SchemaFactory.createForClass(Sales)

