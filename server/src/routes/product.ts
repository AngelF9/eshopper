import { Router, Request, Response } from "express";
import { ProductModel } from "../models/product";
import { verifyToken } from "./user";
import { UserModel } from "../models/user";

const router = Router();

// Not using req so _ is to be used
router.get("/", verifyToken, async (_, res: Response) => {
  try {
    // retrive all
    const products = await ProductModel.find({});
    res.json({ products });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/checkout", verifyToken, async (req: Request, res: Response) => {
  const { customerID, cartItems } = req.body;
  try {
    // should return one user with specified id
    const user = await UserModel.findById(customerID);
    const productIDs = Object.keys(cartItems);
    const products = await 
  } catch (error) {
    res.status(400).json(error);
  }
});

export { router as productRouter };
