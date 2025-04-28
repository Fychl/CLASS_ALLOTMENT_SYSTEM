const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  teacherId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  courses: {
    type: [String],  // Array of course codes or names
    default: []
  },
  passwordHash: {
    type: String,
    required: true
  }
}, { timestamps: true });

const studentSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  course: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);
const Student = mongoose.model('Student', studentSchema);

module.exports = { Teacher, Student };
