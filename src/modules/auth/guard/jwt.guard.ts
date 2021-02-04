import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import JwtRequest from '../interface/JwtRequest';
import { JwtManipulationProvider } from '../provider';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @Inject(JwtManipulationProvider.name)
    private readonly jwtManipulationProvider: JwtManipulationProvider,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.headers.authorization) {
      return false;
    }
    const { authorization } = request.headers;
    const token = authorization.replace('Bearer ', '');
    console.log(token);
    return this.jwtManipulationProvider.isValidJwt(token);
  }
}
