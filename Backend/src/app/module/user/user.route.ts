import { Router } from "express";

import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import {
  createUserZodSchema,
  promoteUserZodSchema,
  updateUserZodSchema,
} from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser,
);

// * update user
router.patch(
  "/update/:id",
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser,
);

// * promote user to admin
router.patch(
  "/promote/:id",
  validateRequest(promoteUserZodSchema),
  checkAuth(Role.ADMIN),
  UserControllers.promoteUser,
);

router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUser);

// /api/v1/user/:id
export const UserRoutes = router;
