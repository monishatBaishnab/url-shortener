import { Server } from 'http';
import app from './app.js';
import { config } from './app/config/index.js';

let server: Server;

const main = async () => {
  server = app.listen(config.PORT, () => {
    console.log('Server Running on port: ', config.PORT);
  });
};

main();
