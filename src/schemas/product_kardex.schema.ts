import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type ProductKardexDocument = mongoose.HydratedDocument<ProductKardex>

@Schema({ timestamps: true })
export class ProductKardex {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Kardex', required: true })
    kardex_id: mongoose.Types.ObjectId;

}

export const ProductKardexSchema = SchemaFactory.createForClass(ProductKardex)