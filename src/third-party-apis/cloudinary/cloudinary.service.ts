import { Injectable, Inject } from '@nestjs/common';
import { Cloudinary } from './cloudinary.provider';

@Injectable()
export class CloudinaryService {
  constructor(@Inject(Cloudinary) private cloudinary) {
    cloudinary.config({
      cloud_name: 'solara',
      api_key: '679332641118158',
      api_secret: 'XmcuLRzrpPNOnaCG5pMMOWBczwM',
    });
  }

  /**
   * Function that deletes image from Scoiti Cloudinary account by image
   * public id.
   * @param {string} publicID - String
   * @returns {Promise<any>}
   * Vlad. 12/05/21
   */
  async deleteImage(publicID: string) {
    return await this.cloudinary.v2.uploader.destroy(
      publicID,
      (err, result) => {
        return true;
      },
    );
  }
}
