import JWT from "jsonwebtoken";

export const createJWT = (userId) => {
  return JWT.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};
