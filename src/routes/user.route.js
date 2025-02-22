import { Router } from "express";
import { logoutUser, registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();


router.post('/register',upload.fields([
    {name:"avatar",maxCount:1},
    {name:"coverImage",maxCount:1}
]),
    
    registerUser)

    router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)

export default router;