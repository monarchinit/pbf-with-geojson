import { Router }         from "express";
import ZipCodeController   from "./zipCode.controller";


const router = Router();

router.get(
  "/",
  ZipCodeController.generatePBF
);


export const zipCodeRouter = router;
