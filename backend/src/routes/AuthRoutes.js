import { Router } from "express";
import { addProfileImage, getUserInfo, login, logout, removeProfileImage, signup, updateProfile } from "../controllers/AuthController.js";
import verifyToken from "../middleware/AuthMiddleware.js";
import multer from "multer";


const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/" });


authRoutes.get('/user-info', verifyToken, getUserInfo );
authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/update-profile', verifyToken, updateProfile);
authRoutes.post(
  '/add-profile-image',
  verifyToken, 
  upload.single("profile-image"),
  addProfileImage
);
authRoutes.post('/logout', logout);
authRoutes.delete('/remove-profile-image', verifyToken, removeProfileImage);

export default authRoutes;