import { createJWT } from '../utils/generateToken';

export const generateToken = async (req, res, next) => {
    try {
      const { userId } = req.body;
  
      const token = createJWT(userId);
  
      res.status(200).json({
        success: true,
        message: 'Token generated successfully',
        token
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Token generation failed",
        success: false,
        error: error.message,
        token: ''
      });
    }
  };