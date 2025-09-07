/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelper/AppError";
import { createUserToken } from "../../utils/userTokens";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(401, err));
      }
      if (!user) {
        return next(new AppError(401, info.message));
      }
      const userToken = await createUserToken(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: pass, ...rest } = user.toObject();
      setAuthCookie(res, userToken);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
          accessToken: userToken.accessToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

//  logout
const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged Out Successfully",
    data: null,
  });
});

// google
const googleCallbackController = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    const tokenInfo = createUserToken(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);
export const AuthControllers = {
  credentialsLogin,
  logout,
  googleCallbackController,
};
