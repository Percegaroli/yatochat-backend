import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type GenericObject = { [key: string]: any };

@Injectable()
export class JwtManipulationProvider {
  constructor(private readonly jwtService: JwtService) {}

  isValidJwt(jwt: string) {
    try {
      return !!this.jwtService.verify(jwt);
    } catch (error) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Please authenticate',
      });
    }
  }

  decodeJwt(jwt: string) {
    this.isValidJwt(jwt);
    return this.jwtService.decode(jwt);
  }

  createJwt<T extends GenericObject>(payload: T) {
    return this.jwtService.sign(payload, {
      expiresIn: '48h',
    });
  }
}
