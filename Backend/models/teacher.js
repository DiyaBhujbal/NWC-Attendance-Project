import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import mongooseSequence from 'mongoose-sequence';

const autoIncrement = mongooseSequence(mongoose);

const dailyRecordSchema = new mongoose.Schema({
  
  day:{ type: String },
  date: { type: Date },
  time: [{ type: String }], 
  className: { type: String },
  subject: { type: String },
  room_number: { type: String },
  remark: { type: String },
  note:{ type: mongoose.Schema.Types.Mixed , default: '' },
  academicyear:{ type: String },
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

dailyRecordSchema.plugin(autoIncrement, { inc_field: 'id' }); // Apply the auto-increment plugin


const formatDate = (date) => {
  if (!date) return null;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const yyyy = String(date.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
};


const TeacherSchema = new mongoose.Schema({
  username: { type: String, required: true },
  dob: {type: Date,get: formatDate},
  qualification:{ type: String },
  depname:{ type: String },
  joiningdate: {type: Date,get: formatDate},
  listofsub: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }], // Reference to Class model
  listofclasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }], // Reference to Class model
  email: { type: String, required: true, unique: true , validate:validator.isEmail},
  password: { type: String, required: true , minlenght:[8,"password must be at 8 characters"]},
  contact:{ type: Number },
  isVerified: {type: Boolean,default: false},
  dailyRecord: [dailyRecordSchema] 

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
