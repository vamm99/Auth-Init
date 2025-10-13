import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type UserDocument = HydratedDocument<User>

export enum UserRole {
    ADMIN = 'admin',
    SELLER = 'seller',
    CUSTOMER = 'customer',
}

@Schema()
export class User {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    idNumber: string;

    @Prop({ required: true })
    typeDocument: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: UserRole, default: UserRole.CUSTOMER })
    role: UserRole;

    @Prop({ required: true, default: true })
    status: boolean;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;


}

export const UserSchema = SchemaFactory.createForClass(User)

