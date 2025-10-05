import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from '../decorators/public.decorator';
import { User } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() user:RegisterDto){
    return this.authService.register(user)
  }

  @Public()
  @Post('login')
  async login(@Body() user:LoginDto){
    return this.authService.login(user)
  }

  @Get('profile')
  async getProfile(@User() user){
    return user
  }
}

