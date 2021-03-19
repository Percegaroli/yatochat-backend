import { Module } from '@nestjs/common';
import { PhotoUploadProvider } from './providers/PhotoUploadProvider';

@Module({
  providers: [PhotoUploadProvider],
  exports: [PhotoUploadProvider],
})
export class PhotoUploadModule {}
