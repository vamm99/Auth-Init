import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose"
import mongoose from "mongoose"

export type PaymentDocument = mongoose.HydratedDocument<Payment>

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

export enum PaymentMethod {
    BAMCOLOMBIA = 'bamcolombia',
    PAYPAL = 'paypal'
}

@Schema({ timestamps: true })
export class Payment {
    
    @Prop({ required: true, type: mongoose.Schema.Types.Array })
    products: mongoose.Types.Array<{ 
        product_id: mongoose.Types.ObjectId, 
        price: number,
        quantity: number 
    }>;

    @Prop({ required: true, min: 0 })
    total: number;

    @Prop({ required: true })
    payment_method: PaymentMethod;

    @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment)

