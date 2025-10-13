import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type UserProductDocument = mongoose.HydratedDocument<UserProduct>

export class UserProduct {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product_id: mongoose.Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const UserProductSchema = SchemaFactory.createForClass(UserProduct)
