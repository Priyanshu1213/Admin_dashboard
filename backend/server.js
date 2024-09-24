const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
require('dotenv').config();

const path = require('path');




const app = express();
// app.use(cors());
const corsOptions = {
  origin: ["http://localhost:3000","https://machinetext.vercel.app/"],
  credentials: true,
};

app.use(cors(corsOptions));





app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
