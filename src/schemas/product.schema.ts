import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export type ProductDocument = HydratedDocument<Product>;
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image_url: string;

  @Prop({ required: true })
  cost: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true })
  status: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true })
  category_id: mongoose.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);;

ProductSchema.plugin(mongoosePaginate);