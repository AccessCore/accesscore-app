import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationDto } from './dto/authentication.dto';
import { AuthenticationFaceDto } from './dto/authenticationface.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UsePipes(ValidationPipe)
  @Post()
  auth(@Body() authenticationDto: AuthenticationDto) {
    return this.authService.auth(authenticationDto);
  }

  @UsePipes(ValidationPipe)
  @Post('/face')
  authFace(@Body() authenticationFaceDto: AuthenticationFaceDto) {
    return this.authService.authFace(authenticationFaceDto);
  }
}
