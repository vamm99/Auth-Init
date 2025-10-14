import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export type UserSalesDocument = mongoose.HydratedDocument<UserSales>

@Schema({ timestamps: true })
export class UserSales {
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Sales', required: true })
    sales_id: mongoose.Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const UserSalesSchema = SchemaFactory.createForClass(UserSales)

UserSalesSchema.plugin(mongoosePaginate);