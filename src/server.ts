import app from './app';
import connectDB from './config/db';
import config from './config/keys';

const PORT = config.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection failed:', err));
