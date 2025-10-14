import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UserModule } from '../user/user.module';
import { AuthRepository } from './repository/auth.repository';
import { BcryptService } from './service/bcrypt.service';
import { JwtStrategy } from './core/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NodemailerService } from 'src/util/email/nodemailer.service';

@Module({
  imports: [UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, BcryptService, JwtStrategy, NodemailerService],
})
export class AuthModule {}
