import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const dailyRecordSchema = new mongoose.Schema({
  day:{ type: String },
  date: { type: Date },
  time: { type: String }, // You can use Date type if storing time in a different format
  subject: { type: String },
  room_number: { type: String },
  period_number: { type: Number },
  className: { type: String },
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
// TeacherSchema.pre("save", async function () {
//   if (!this.isModified) return;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

TeacherSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
}); 

//compare password
TeacherSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
TeacherSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};



const Teacher =mongoose.model('Teacher', TeacherSchema);
export default Teacher;
