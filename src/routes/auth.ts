import bcrypt from "bcryptjs";
import { isEmpty, validate } from "class-validator";
import cookie from "cookie";
import { Request, Response, Router } from "express";
import { sign } from "jsonwebtoken";
import { User } from "../entities/User";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const mapErrors = (errors: Object[]) =>
  errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    let errors: any = {};
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });
    if (emailUser) errors.email = "Email is already taken";
    if (usernameUser) errors.username = "Username is already taken";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
    const user = new User({ username, email, password });
    errors = await validate(user);
    if (errors.length > 0) return res.status(400).json(mapErrors(errors));
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const errors: any = {};
    if (isEmpty(username)) errors.username = "Username must not be empty";
    if (isEmpty(password)) errors.password = "Password must not be empty";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ username: "User not found" });
    const passMatched = await bcrypt.compare(password, user.password);
    if (!passMatched)
      return res.status(401).json({ password: "Wrong credentials" });
    const token = sign({ username }, process.env.JWT_SECRET!);
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 3600,
      })
    );
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

const me = (_: Request, res: Response) => res.status(200).json(res.locals.user);

const logout = async (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    })
  );
  return res.status(200).json({ success: true });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", user, auth, me);
router.get("/logout", user, auth, logout);
export default router;
