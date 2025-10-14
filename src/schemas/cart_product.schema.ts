import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type CartProductDocument = mongoose.HydratedDocument<CartProduct>

@Schema({ timestamps: true })
export class CartProduct {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true })
    cart_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product_id: mongoose.Types.ObjectId;

}

export const CartProductSchema = SchemaFactory.createForClass(CartProduct)

