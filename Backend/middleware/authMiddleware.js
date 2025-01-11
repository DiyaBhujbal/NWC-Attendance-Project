
import JWT from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config()

const userAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from the Authorization header
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY); // Replace 'your_secret_key' with your actual secret
    req.userId = decoded.id; // Attach the user ID to the request object
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default userAuth;

