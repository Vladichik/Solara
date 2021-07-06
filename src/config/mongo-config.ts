import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

@Injectable()
export default class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    const DB_NAME =
      process.env.NODE_ENV &&
      (process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'staging')
        ? 'solara-db-prod'
        : 'solara-db-dev';
    return {
      uri: `mongodb+srv://solara:solara.app.2021@cluster0.xkafi.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
    };
  }
}
