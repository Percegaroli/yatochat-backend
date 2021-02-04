import { Controller, Post, Body } from '@nestjs/common';
import { NewUserDTO } from '../DTO/NewUserDTO';
import { UserService } from '../service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  newUser(@Body() newUserDTO: NewUserDTO) {
    return this.userService.createUserAndLogin(newUserDTO);
  }
}
