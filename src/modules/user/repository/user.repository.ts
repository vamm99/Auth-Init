import { User } from "../schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class UserRepository {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    
}