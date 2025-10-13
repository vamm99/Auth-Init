import { Prop, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"

export type UserPaymentDocument = mongoose.HydratedDocument<UserPayment>

export class UserPayment {
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true })
    payment_id: mongoose.Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const UserPaymentSchema = SchemaFactory.createForClass(UserPayment)

