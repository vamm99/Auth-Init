import { User } from "../schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class UserRepository {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async create(user: User) {
        const existingUser = await this.userModel.findOne({ email: user.email });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const newUser = await this.userModel.create(user)

        return newUser
    }
}