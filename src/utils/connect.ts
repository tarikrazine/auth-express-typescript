import mongoose from 'mongoose';
import config from 'config';

import log from './logger';

const connect = async () => {
  const uriDB = config.get<string>('uriDB');

  try {
    await mongoose.connect(uriDB);
    log.info('Database connected with success');
  } catch (error: any) {
    log.error(error, 'Database not connected');
    process.exit(1);
  }
};

export default connect;
