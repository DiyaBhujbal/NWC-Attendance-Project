import mongoose from 'mongoose';

const verificationTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // Token expires in 1 hour
    },
});

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);
export default VerificationToken;
