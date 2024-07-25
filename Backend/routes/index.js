import express from "express";

import authRoute from "./authRoutes.js";
import teacherRoute from "./teacherRoutes.js"
import dialyRecordRoute from "./dailyRecordRoutes.js"
import classRoute from "./classRoute.js"
import tokenRoute from "./token.js"
const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute); //api-v1/auth/
router.use(`${path}teacher`, teacherRoute); 
router.use(`${path}daily-record`, dialyRecordRoute); 
router.use(`${path}class`, classRoute); 
router.use(`${path}token`,tokenRoute);
export default router;