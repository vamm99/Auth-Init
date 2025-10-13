import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type ProductKardexDocument = mongoose.HydratedDocument<ProductKardex>

export class ProductKardex {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Kardex', required: true })
    kardex_id: mongoose.Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const ProductKardexSchema = SchemaFactory.createForClass(ProductKardex)