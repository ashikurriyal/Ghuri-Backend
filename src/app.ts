import Express = require("express");
import cors from "cors";
import { router } from "./app/Routes";

const app = Express();
app.use(Express.json());
app.use(cors());


app.use("/api/v1", router);

app.get("/", (req: Express.Request, res: Express.Response) => {
  res.status(200).json({
    message: "Welcome to 'Ghuri' - Tour Management System Backend",
  });
});

export = app;
