import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type SalesDocument = mongoose.HydratedDocument<Sales>

export enum SalesStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

@Schema({ timestamps: true })
export class Sales {
    
    products: mongoose.Types.Array<{ 
        product_id: mongoose.Types.ObjectId, 
        price: number,
        quantity: number 
    }>;

    total: number;

    @Prop({ enum: SalesStatus, default: SalesStatus.PENDING })
    status: SalesStatus;
}

export const SalesSchema = SchemaFactory.createForClass(Sales)

