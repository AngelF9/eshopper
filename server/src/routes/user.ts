import { Router, Request, Response } from "express";
import { UserModel } from "../models/user";
import { UserErrors } from "./errors";
import bcrypt from "bcrypt";

// create a new router object
const router = Router();
// first router request
// when someone makes a request to localhost:3001/register
// whatever code we write here should satisfy that request
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (user) {
      // user does exist so return
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }

    // creating hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    // created the new user
    const newUser = new UserModel({ username, password: hashedPassword });
    // save the changes
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    // return back with a status of 500: server error
    res.status(500).json({ type: err });
  }
});

// would like to import route within the index.ts file
// so simplity export...
export { router as userRouter };
