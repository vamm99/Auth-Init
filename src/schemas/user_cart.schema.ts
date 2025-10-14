import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";


export type UserCartDocument = mongoose.HydratedDocument<UserCart>

@Schema({ timestamps: true })
export class UserCart {
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true })
    cart_id: mongoose.Types.ObjectId;
}

export const UserCartSchema = SchemaFactory.createForClass(UserCart)
