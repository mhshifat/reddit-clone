import { Request, Response, Router } from "express";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Vote } from "../entities/Vote";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const createVote = async (req: Request, res: Response) => {
	const { identifier, slug, commentIdentifier, value } = req.body;

	if (![-1, 0, 1].includes(value))
		return res.status(400).json({ value: "Value must be -1, 0 or 1" });

	try {
		const user: User = res.locals.user;
		let post = await Post.findOneOrFail({ identifier, slug });
		let vote: Vote | undefined;
		let comment: Comment | undefined;

		if (commentIdentifier) {
			comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
			vote = await Vote.findOne({ comment, user });
		} else {
			vote = await Vote.findOne({ post, user });
		}

		if (!vote && vote === 0) {
			return res.status(404).json({ error: "Vote not found" });
		} else if (!vote) {
			vote = new Vote({ user, value });
			if (comment) vote.comment = comment;
			else vote.post = post;
			await vote.save();
		} else if (value === 0) {
			await vote.remove();
		} else if (vote.value !== value) {
			vote.value = value;
			await vote.save();
		}

		post = await Post.findOneOrFail(
			{ identifier, slug },
			{ relations: ["comments", "comments.votes", "votes", "sub"] }
		);

		post.setUserVote(user);
		post.comments.forEach((comment) => comment.setUserVote(user));

		return res.status(200).json(post);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

const router = Router();
router.post("/vote", user, auth, createVote);
export default router;
