import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';
import { NewUserDTO } from '../DTO/NewUserDTO';
import { UserService } from '../service';
import { JwtGuard } from '../../auth/guard/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  newUser(@Body() newUserDTO: NewUserDTO) {
    return this.userService.createUserAndLogin(newUserDTO);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  userDetails(@Param('id') id: string) {
    return this.userService.getLoggedUserDetails(id);
  }
}
