import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtManipulationProvider } from './provider';
import { AuthController } from './controller';
import { AuthService } from './service';
import { UserModule } from '../user';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
      }),
    }),
    ConfigModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [JwtManipulationProvider, AuthService],
  exports: [JwtManipulationProvider],
})
export class AuthModule {}
