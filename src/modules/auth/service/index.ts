import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtManipulationProvider } from '../provider';
import { LoginPostDTO } from '../DTO/LoginPostDTO';
import { UserService } from 'src/modules/user/service';
import { UserDocument } from 'src/modules/user/schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtManipulationProvider: JwtManipulationProvider,
    private readonly userService: UserService,
  ) {}

  async login(loginDTO: LoginPostDTO) {
    const { email, password } = loginDTO;
    const user = await this.userService.getUserByEmail(email);
    this.checkIfUserExists(user);
    this.checkForValidPassword(user, password);
    return this.jwtManipulationProvider.createJwt({ id: user._id });
  }

  async checkForValidPassword(user: UserDocument, password: string) {
    const isValid = await compare(password, user.password);
    if (!isValid) this.throwBadRequest();
  }

  checkIfUserExists(user: UserDocument | undefined) {
    if (!user) this.throwBadRequest();
  }

  throwBadRequest(message = 'Usuario ou senha invalido') {
    throw new BadRequestException({
      status: HttpStatus.BAD_REQUEST,
      message,
    });
  }
}
