import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export type UserProductDocument = mongoose.HydratedDocument<UserProduct>

@Schema({ timestamps: true })
export class UserProduct {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product_id: mongoose.Types.ObjectId;
}

export const UserProductSchema = SchemaFactory.createForClass(UserProduct)

UserProductSchema.plugin(mongoosePaginate);
