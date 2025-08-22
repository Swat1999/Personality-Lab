const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalInfo: {
    firstName: String,
    lastName: String,
    age: Number,
    dob: Date,
    occupation: String,
    maritalStatus: String
  },
  answers: Object,
  personality: String,
  improvements: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', TestResultSchema);
