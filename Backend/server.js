const dotenv = require('dotenv');
const app = require('./app');
const { config } = require('./config');

// Load environment variables from .env file.
dotenv.config();

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`FoodLink AI backend is running on port ${PORT}`);
});
