require('dotenv').config();
import express from 'express';
import config from 'config';

import log from './utils/logger';
import connect from './utils/connect';
import router from './routes';
import deserializeUser from './middlewares/deserializeUser';

const app = express();

const port = config.get<string>('port');

app.use(express.json());

app.use(deserializeUser);

app.use(router);

app.listen(port, async () => {
  log.info(`Server running on http://localhost:${port}`);

  connect();
});
