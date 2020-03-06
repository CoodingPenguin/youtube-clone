import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { localMiddleware } from "./middlewares";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

const app = express();

// pug
app.set("view engine", "pug");

app.use("/uploads", express.static("uploads"));

// middlewares : use it up to bottom
app.use(helmet()); // for security
app.use(cookieParser()); // about cookies
app.use(bodyParser.json()); // form or json for delivery
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); // for dev to see logs

// custom middlewares
app.use(localMiddleware);

// routers
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
