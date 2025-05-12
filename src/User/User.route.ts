import { Router } from 'express';
import { createUser, loginUser, getUsers, getUserById, updateUserById, deleteUserById } from './User.controller';
import {verifyJWT} from "../common/jwt.middleware";

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:userId', verifyJWT, getUserById);
router.patch('/:userId', verifyJWT, updateUserById);
router.delete('/:userId', verifyJWT, deleteUserById);

export default router;