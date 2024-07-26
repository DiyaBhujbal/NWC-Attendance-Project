import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const dailyRecordSchema = new mongoose.Schema({
  day:{ type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // You can use Date type if storing time in a different format
  subject: { type: String, required: true },
  room_number: { type: String },
  period_number: { type: Number },
  className: { type: String, required: true },
  remark: { type: String },
  total_students_present:{type:Number},
  attendance:[
    {   
      roll_no: {type:Number }, 
      status: {type:Boolean}
    }
  ]
},
{timestamps:true}
);


const TeacherSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true , validate:validator.isEmail},
  password: { type: String, required: true , minlenght:[8,"passowrd must be at 8 characters"]},
  dailyRecord: [dailyRecordSchema] // Array of daily records

},
  {timestamps:true}
);




// middelwares
TeacherSchema.pre("save", async function () {
  if (!this.isModified) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
TeacherSchema.methods.comparePassword = async function (teacherPassword) {
  const isMatch = await bcrypt.compare(teacherPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
TeacherSchema.methods.createJWT = function () {
  return JWT.sign({ teacherId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};



const Teacher =mongoose.model('Teacher', TeacherSchema);
export default Teacher;
