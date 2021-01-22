import express from "express";
import { stateRouter } from "./state/state.router";
import { countyRouter } from "./county/county.router";
import { zipCodeRouter } from "./zipCode/zipCode.router";

export class FilmsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddleware();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json());
  }

  initRoutes() {
    this.server.use("/adm1", stateRouter);
    this.server.use("/adm2", countyRouter);
    this.server.use("/adm3", zipCodeRouter);
    this.server.use((err, req, res, next) => {
      console.log(err);
      delete err.stack;
      next(err);
    });
  }

  startListening() {
    const port = process.env.PORT || 1234;

    this.server.listen(port, () => {
      console.log("Server started listening on port", port);
    });
  }
}
