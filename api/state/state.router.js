import { Router }         from "express";
import StateController   from "./state.controller";


const router = Router();

router.get(
  "/",
  StateController.generatePBF
);


export const stateRouter = router;
