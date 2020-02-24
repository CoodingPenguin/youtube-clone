import routes from "./routes";

// can add variables that you want to use globally
export const localMiddleware = (req, res, next) => {
  res.locals.siteName = "WeTube";
  res.locals.routes = routes;
  next();
};
