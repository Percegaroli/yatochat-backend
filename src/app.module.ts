import { Module } from '@nestjs/common';
import MongoConnection from './config/database';
import { UserModule } from './modules/user';
import { EnvConfig } from './config/configModule';

@Module({
  imports: [EnvConfig, MongoConnection, UserModule],
})
export class AppModule {}
