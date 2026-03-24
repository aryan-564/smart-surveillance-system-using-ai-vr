const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { initSocket } = require('./socket');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Init DB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/surveillance_db')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Init socket
initSocket(server);

// Routes
app.use('/api/auth', authRoutes);

// Optional endpoint to receive AI data via REST if not using socket
app.post('/api/ai/data', (req, res) => {
  const { person_count, product_count, timestamp, employees_status } = req.body;
  // Can be used to broadcast
  const io = require('./socket').getIo();
  if (io) {
    io.emit('ai_data', req.body);
  }
  res.status(200).json({ success: true });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
