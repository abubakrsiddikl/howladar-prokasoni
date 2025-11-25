import express, { type Request, type Response } from "express";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import cors from "cors";
import prerender from "prerender-node";

import "./app/config/passport";

const app = express();
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(prerender.set("prerenderToken", envVars.PRERENDER_IO_TOKEN));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "welcome to the server" });
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
