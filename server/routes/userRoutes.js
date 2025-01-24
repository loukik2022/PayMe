import { Router } from 'express';
import { signup, signin, signout, refreshToken } from "../controllers/authController.js";
import { createUser, getUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { 
    checkToken, 
    checkRole, 
    checkDuplicateUserOrEmailExist, 
    checkRoleExist 
} from "../middlewares/verifyAuth.js";
import { checkUserExists } from '../middlewares/verifyUser.js';

const router = Router();

router.post("/signup", [checkDuplicateUserOrEmailExist, checkRoleExist], signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/refreshToken", checkToken, refreshToken);

router.post('/create', createUser);
router.get('/:userId', [checkToken, checkUserExists], getUser);
router.patch('/:userId', [checkToken, checkUserExists], updateUser);

// admin
router.get("/allUser", [checkToken, checkRole(["admin"])], getAllUsers);
router.delete('/:userId', [checkToken, checkRole('admin'), checkUserExists], deleteUser);

export default router;