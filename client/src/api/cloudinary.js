import { api } from 'boot/axios';

const CLOUDINARY_API_BASE = '/cloudinary';

export default class CloudinaryAPI {
  /**
   * Api call that calls Cloudinary image delete
   * @param imageID - String
   * @return
   * Vlad. 03/08/21
   */
  static deleteImageFromCloudinary(imageID) {
    return api.delete(`${CLOUDINARY_API_BASE}/${imageID}`);
  }
}
