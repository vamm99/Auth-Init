import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose"
import mongoose from "mongoose"

export type UserPaymentDocument = mongoose.HydratedDocument<UserPayment>

@Schema({ timestamps: true })
export class UserPayment {
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true })
    payment_id: mongoose.Types.ObjectId;
}

export const UserPaymentSchema = SchemaFactory.createForClass(UserPayment)

