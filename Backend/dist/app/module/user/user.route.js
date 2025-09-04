"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = require("../../middleware/validateRequest");
const checkAuth_1 = require("../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
// * update user
router.patch("/update/:id", (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.updateUser);
// * promote user to admin
router.patch("/promote/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserControllers.promoteUser);
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.getMe);
// /api/v1/user/:id
exports.UserRoutes = router;
