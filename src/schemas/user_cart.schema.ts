import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


export type UserCartDocument = mongoose.HydratedDocument<UserCart>

export class UserCart {
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true })
    cart_id: mongoose.Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const UserCartSchema = SchemaFactory.createForClass(UserCart)
