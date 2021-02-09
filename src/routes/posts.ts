import { Request, Response, Router } from "express";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";
import { User } from "../entities/User";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;
  const user: User = res.locals.user;

  if (title.trim() == "")
    return res.status(400).json({ title: "Title must not be empty" });

  try {
    const subRecord = await Sub.findOneOrFail({ name: sub });
    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getPosts = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find({
      order: { createdAt: "DESC" },
      relations: ["comments", "votes", "sub"],
    });
    if (res.locals.user)
      posts.forEach((post) => post.setUserVote(res.locals.user));
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  try {
    const post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["sub", "votes", "comments"] }
    );
    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }
    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(404).json({ error: "Post not found" });
  }
};

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const user: User = res.locals.user;
  const body = req.body.body;

  try {
    const post = await Post.findOneOrFail({ identifier, slug });
    const comment = new Comment({ body, user, post });
    await comment.save();
    return res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    return res.status(404).json({ error: "Post not found" });
  }
};

const router = Router();
router.post("/", user, auth, createPost);
router.get("/", user, getPosts);
router.get("/:identifier/:slug", user, getPost);
router.post("/:identifier/:slug/comments", user, auth, commentOnPost);
export default router;
