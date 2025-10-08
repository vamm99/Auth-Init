import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type KardexDocument = HydratedDocument<Kardex>

export class Kardex {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product_id: mongoose.Types.ObjectId;
    
    @Prop({ required: true })
    comment: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    stock: number;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const KardexSchema = SchemaFactory.createForClass(Kardex)
