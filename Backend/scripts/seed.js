const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Facility = require('../models/Facility');
const facilities = require('../mock/facilities.json');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Facility.deleteMany();
    await Facility.insertMany(facilities);
    console.log('✅ Mock facilities imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
