import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { NewUserDTO } from '../DTO/NewUserDTO';
import { UserService } from '../service';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  newUser(@Body() newUserDTO: NewUserDTO) {
    return this.userService.createUserAndLogin(newUserDTO);
  }

  @Patch(':id/photo')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('profile', { storage: memoryStorage() }))
  uploadUserPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    console.log(file);
    return this.userService.updateUserPhoto(file, id);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  userDetails(@Param('id') id: string) {
    return this.userService.getLoggedUserDetails(id);
  }
}
