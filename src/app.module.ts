import { Module } from '@nestjs/common';
import MongoConnection from './config/database';
import { Modules } from './modules';
import { EnvConfig } from './config/configModule';

@Module({
  imports: [EnvConfig, MongoConnection, Modules],
})
export class AppModule {}
