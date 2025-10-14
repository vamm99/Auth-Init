import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export type UserReviewDocument = mongoose.HydratedDocument<UserReview>

@Schema({ timestamps: true })
export class UserReview {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true })
    review_id: mongoose.Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const UserReviewSchema = SchemaFactory.createForClass(UserReview)

UserReviewSchema.plugin(mongoosePaginate);
