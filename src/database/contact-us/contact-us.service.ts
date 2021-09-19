import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactUs } from './contact-us.interface';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel('ContactUs')
    private contactUsModel: Model<ContactUs>,
  ) {}

  async getSolaraContactDetails(): Promise<ContactUs> {
    const allContacts = await this.contactUsModel.find();
    return allContacts[0];
  }
}
