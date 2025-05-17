// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// DB 연결
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// API 경로 연결
const sentenceRoutes = require('./routes/sentences');
app.use('/sentences', sentenceRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
