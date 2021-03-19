import { Injectable } from '@nestjs/common';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
const streamifier = require('streamifier');
import { configCloudinary } from '../../../config/cloudinary';

@Injectable()
export class PhotoUploadProvider {
  private cloudinary = configCloudinary();

  uploadUserPhoto(image: Express.Multer.File, currentPhotoUrl?: string) {
    const currentPhotoName = this.getCurrentPhotoName(currentPhotoUrl);
    return this.uploadPhoto(image, 'user', currentPhotoName);
  }

  uploadGroupPhoto(image: Express.Multer.File, currentPhotoUrl?: string) {
    const currentPhotoName = this.getCurrentPhotoName(currentPhotoUrl);
    return this.uploadPhoto(image, 'group', currentPhotoName);
  }

  private uploadPhoto = (
    photo: Express.Multer.File,
    folder: string,
    fileName?: string,
  ): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
      const options: UploadApiOptions = { folder };
      if (fileName) options.public_id = fileName;
      const uploadStream = this.cloudinary.uploader.upload_stream(
        options,
        (err, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(err);
          }
        },
      );
      streamifier.createReadStream(photo.buffer).pipe(uploadStream);
    });
  };

  private getCurrentPhotoName(currenPhotoUrl?: string) {
    if (!currenPhotoUrl) return '';
    const urlSplitted = currenPhotoUrl.split('/');
    return urlSplitted[urlSplitted.length - 1].split('.')[0];
  }
}
