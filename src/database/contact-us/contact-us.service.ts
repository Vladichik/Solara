import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './contact-us.interface';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel('Contact')
    private contactUsModel: Model<Contact>,
  ) {}

  async getSolaraContactDetails(): Promise<Contact> {
    const allContacts = await this.contactUsModel.find();
    return allContacts[0];
  }
}
