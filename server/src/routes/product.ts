import { Router, Request, Response } from "express";
import { ProductModel } from "../models/product";
import { verifyToken } from "./user";
import { UserModel } from "../models/user";
import { UserErrors, ProductErrors } from "./errors";

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
  // cartItems is an object sent from frontEnd
  const { customerID, cartItems } = req.body;
  try {
    // should return one user with specified id
    const user = await UserModel.findById(customerID);
    // creating a list of keys from cartItems
    const productIDs = Object.keys(cartItems);
    // from mongoose, creat var and set to await (remeber mongoose/mongoDB is asynchronous)
    // entries from product collections: items from this collection should have an id that is inside productID list
    const products = await ProductModel.find({ _id: { $in: productIDs } });
    // making checks
    // customer ID is not real
    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }
    // error finding a product
    if (products.length !== productIDs.length) {
      return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
    }

    let totalPrice = 0;

    // looping through keys in cart items
    for (const item in cartItems) {
      // get product that correlates to item
      // find allows us to loop through 'products' list
      // condition: item should be the same as product id
      // item is of type string, product id is of type ObjectID
      const product = products.find((product) => String(product._id) === item);

      // if product does not exist
      if (!product) {
        return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
      }
      // if the amount in stock is less the amount we want to buy: ERROR
      if (product.stockQuantity < cartItems[item]) {
        return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
      }

      // calculating the total price for item
      totalPrice += product.price * cartItems[item];
    }
    if (user.availableMoney < totalPrice) {
      return res.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY });
    }
    // executing the purchase
    user.availableMoney -= totalPrice;
    // adding all items to the end of purchased items list
    user.purchasedItems.push(...productIDs);
    // saving changes made to user. await used because of mongoose interaction
    await user.save();
    // updating entries, id included in productIDs list.
    // for each item in the list, increment stock item by -1
    await ProductModel.updateMany(
      { _id: { $in: productIDs } },
      { $inc: { stockQuantity: -1 } },
    );
    // sending back the purchased items: not a list of IDs
    //  grabing back a list of actual items... everything related to these items
    res.json({ purchasedItems: user.purchasedItems });
  } catch (error) {
    res.status(400).json(error);
  }
});

export { router as productRouter };
