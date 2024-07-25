import JWT from "jsonwebtoken";

export const createJWT = (userId) => {
  console.log("user id", userId)
  return JWT.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};
