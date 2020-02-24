import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";

const app = express();

// pug
app.set("view engine", "pug");

// middlewares
app.use(cookieParser()); // about cookies
app.use(bodyParser.json()); // form or json for delivery
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet()); // for security
app.use(morgan("dev")); // for dev to see logs

// routers
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
