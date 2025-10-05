import { Types } from "mongoose";

export class PayloadDto {
    id: Types.ObjectId;
    name: string;
    email: string;
    role: string;
}
