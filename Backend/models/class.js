import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";


const Schema = mongoose.Schema;

const classSchema = new Schema({
    name: { type: String, required: true },
    subjects: [{ type: String, required: true }],
    totalStudents: { type: Number, required: true },
    studentsList:[
      {
        student_name:{ type: String, required: true },
        roll_no:{type: Number, required: true }
      }
    ]
  },
  {timestamps:true}
);
  
  const Class =mongoose.model('Class', classSchema);
  export default Class;