import { Router }         from "express";
import CountyController   from "./county.controller";


const router = Router();

router.get(
  "/",
  CountyController.generatePBF
);


export const countyRouter = router;
