import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type KardexDocument = HydratedDocument<Kardex>

@Schema({ timestamps: true })
export class Kardex {

    @Prop({ required: true })
    comment: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    stock: number;

}

export const KardexSchema = SchemaFactory.createForClass(Kardex)
