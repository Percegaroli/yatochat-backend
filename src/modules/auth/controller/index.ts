import { Controller, Post, Body } from '@nestjs/common';
import { LoginPostDTO } from '../DTO/LoginPostDTO';
import { AuthService } from '../service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async Login(@Body() loginDTO: LoginPostDTO) {
    return await this.authService.login(loginDTO);
  }
}
