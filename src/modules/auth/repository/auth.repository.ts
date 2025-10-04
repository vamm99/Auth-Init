import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/modules/user/schema/user.schema";


export class AuthRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ){}

    async register(user: User) {
        const existingUser = await this.userModel.findOne({ email: user.email });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const newUser = await this.userModel.create(user)

        return newUser
    }
}