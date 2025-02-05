import { Router } from 'express';
import {createUser, loginUser} from "./User.controller";
const router = Router();

router.post('/', createUser)

router.post('/login', loginUser)

export default router;