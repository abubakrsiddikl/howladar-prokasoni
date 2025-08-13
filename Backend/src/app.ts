import express, { type Request, type Response } from "express";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import cors from "cors";
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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use("/api/v1", router);
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "welcome to the server" });
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
