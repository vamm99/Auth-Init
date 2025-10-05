import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { PayloadDto } from "../dto/payload.dto";
import { AuthRepository } from "../repository/auth.repository";
import { UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly configService: ConfigService,
        private readonly authRepository: AuthRepository
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwtSecret') || '' ,
        })
    }

    async validate(payload: PayloadDto) {
        const existingUser = await this.authRepository.getUserByEmail(payload.email)
        if (!existingUser) {
            throw new UnauthorizedException('User not found')
        }
        return existingUser
    }
}