import Express = require("express");
import { UserRoutes } from "./app/modules/user/user.route";
import cors from "cors";

const app = Express();
app.use(Express.json());
app.use(cors());


app.use("/api/v1/user", UserRoutes);

app.get("/", (req: Express.Request, res: Express.Response) => {
  res.status(200).json({
    message: "Welcome to 'Ghuri' - Tour Management System Backend",
  });
});

export = app;
