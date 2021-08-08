import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { AddressManual } from './address.manual.interface';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel('AddressManual')
    private addressManualModel: Model<AddressManual>,
  ) {}

  async saveManualAddress(
    address: AddressManual,
  ): Promise<UpdateWriteOpResult> {
    return this.addressManualModel.updateOne(
      { type: address.type, user_id: address.user_id },
      address,
      {
        upsert: true,
      },
    );
  }
}
