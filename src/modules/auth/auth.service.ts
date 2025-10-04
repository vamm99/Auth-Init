import { Injectable } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { User } from 'src/modules/user/schema/user.schema';

@Injectable()
export class AuthService {
    constructor(private readonly authRepository: AuthRepository){}

    async register(user: User){
        return this.authRepository.register(user)
    }
}
