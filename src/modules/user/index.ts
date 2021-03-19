import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller';
import { UserService } from './service';
import { User, UserSchema } from './schema';
import { AuthModule } from '../auth';
import { ChatroomModule } from '../chatroom';
import { PhotoUploadModule } from '../photoUpload';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => ChatroomModule),
    PhotoUploadModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
