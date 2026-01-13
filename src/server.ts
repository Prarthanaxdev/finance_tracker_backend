import app from './app';
import connectDB from './config/db';
import config from './config/keys';

(async () => {
  await connectDB();
  app.listen(config.PORT || 3000);
})();
