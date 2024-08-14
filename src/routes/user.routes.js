import { Router} from "express";
import {registerUser} from "../controllers/user.cotroller.js"
import {upload} from "../middlewares/multer.middleware.js"
const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
           name:"coverImage",
           maxCount:2

        }
    ]),
    
    registerUser)


export default router;