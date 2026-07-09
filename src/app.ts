import Express = require("express");
import cors from "cors";
import { router } from "./app/Routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser"

const app = Express();
app.use(cookieParser())
app.use(Express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Express.Request, res: Express.Response) => {
  res.status(200).json({
    message: "Welcome to 'Ghuri' - Tour Management System Backend",
  });
});

app.use(globalErrorHandler);

//Not Found Error - Must be in the bottom of the globalErrorHandler
app.use(notFound);

export = app;
