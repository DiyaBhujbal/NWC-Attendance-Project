import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();
export const sendEmail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port:465,
        secure:true,
        logger:true,
        debug:true,
        secureConnection:false,
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password
        },
        tls:{
            rejectUnauthorized:true
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Error sending email:', error);
    }
};
