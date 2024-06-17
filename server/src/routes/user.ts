import { Router, Request, Response, NextFunction } from "express";
import { IUser, UserModel } from "../models/user";
import { UserErrors } from "./errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    // create a user of type IUser
    // we get it back from UserModel
    const user: IUser = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }
    // decryption & comparisson of hashed password and cur_pw
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
    }

    // we can now begin the creation of user
    // we created an encrypted version of object
    // object conatins unique identifier for the user
    // so the encrypted version of this unique id will be our token
    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ token, userID: user._id });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

// check if the authicated user is making the request
// for example when buying an item.
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, "secret", (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  }
  // block request
  return res.sendStatus(401);
};

// would like to import route within the index.ts file
// so simplity export...
export { router as userRouter };
