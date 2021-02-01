import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export default MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('DB_PATH'),
    useNewUrlParser: true,
    useCreateIndex: true,
  }),
  inject: [ConfigService],
});
