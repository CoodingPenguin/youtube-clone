import express from "express";
import routes from "../routes";
import {
  postRegisterView,
  postAddComment,
  getDeleteComment
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.get(routes.deleteComment(), getDeleteComment);

export default apiRouter;
