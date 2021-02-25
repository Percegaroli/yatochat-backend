import {
  Injectable,
  BadRequestException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtManipulationProvider } from '../provider';
import { LoginPostDTO } from '../DTO/LoginPostDTO';
import { UserService } from 'src/modules/user/service';
import { UserDocument } from 'src/modules/user/schema';
import { LoginResponseDTO } from '../DTO/LoginResponseDTO';
import { Chatroom } from '../../chatroom/schema/Chatroom';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtManipulationProvider: JwtManipulationProvider,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async login(loginDTO: LoginPostDTO): Promise<LoginResponseDTO> {
    const { email, password } = loginDTO;
    const user = await this.userService.getUserByEmail(email);
    this.checkIfUserExists(user);
    this.checkForValidPassword(user, password);
    return await this.createLoginResponseDTO(user);
  }

  async checkForValidPassword(user: UserDocument, password: string) {
    const isValid = await compare(password, user.password);
    if (!isValid) this.throwBadRequest();
  }

  async createLoginResponseDTO(user: UserDocument): Promise<LoginResponseDTO> {
    const token = this.jwtManipulationProvider.createJwt({ id: user._id });
    const userDTO = await this.userService.createUserDetailedDTO(user);
    return {
      token,
      user: userDTO,
    };
  }

  checkIfUserExists(user: UserDocument | undefined) {
    if (!user) this.throwBadRequest();
  }

  private throwBadRequest(message = 'Usuario ou senha invalido') {
    throw new BadRequestException({
      status: HttpStatus.BAD_REQUEST,
      message,
    });
  }
}
