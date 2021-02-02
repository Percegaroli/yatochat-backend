import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import JwtRequest from './interface/JwtRequest';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<JwtRequest>();
    const { access_token } = request;
    if (access_token) {
      return true;
    }
    return false;
  }
}
