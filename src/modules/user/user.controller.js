import { Router } from "express";
import * as userService from './user.service.js'
import authenticate from "../../db/middleware/user.middleware.js";
const router = Router()

router.post('/signup', userService.signup)
router.post('/login', userService.login)
router.delete('/delete', authenticate, userService.deleteUser)


export default router