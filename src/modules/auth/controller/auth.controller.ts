import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from '../decorators/public.decorator';
import { User } from '../decorators/user.decorator';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
import { SubmitResetPasswordDto } from '../dto/submitResetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() user:RegisterDto){
    return this.authService.register(user)
  }

  @Public()
  @Post('register-seller')
  async registerSeller(@Body() user:RegisterDto){
    return this.authService.registerSeller(user)
  }

  @Public()
  @Post('login')
  async login(@Body() user:LoginDto){
    return this.authService.login(user)
  }

  @Post('update-password')
  async updatePassword(@Body() user:ResetPasswordDto, @User() currentUser){
    return this.authService.updatePassword(user, currentUser._id)
  }

  @Post('submit-reset-password-link')
  async submitResetPasswordLink(@Body() data:SubmitResetPasswordDto){
    return this.authService.submitResetPasswordLink(data.email)
  }

  @Get('profile')
  async getProfile(@User() user){
    return user
  }

  @Put('profile')
  async updateProfile(@Body() profileData: any, @User() user){
    return this.authService.updateProfile(user._id, profileData)
  }

}

