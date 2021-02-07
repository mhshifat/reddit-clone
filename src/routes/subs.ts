import { isEmpty } from "class-validator";
import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import { getRepository } from "typeorm";
import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";
import { User } from "../entities/User";
import auth from "../middlewares/auth";
import user from "../middlewares/user";
import { makeId } from "../utils/helpers";

const createSub = async (req: Request, res: Response) => {
	const { name, title, description } = req.body;
	const user: User = res.locals.user;

	try {
		let errors: any = {};
		if (isEmpty(name)) errors.name = "Name must not be empty";
		if (isEmpty(title)) errors.title = "Title must not be empty";
		const sub = await getRepository(Sub)
			.createQueryBuilder("sub")
			.where("lower(sub.name) = :name", { name: name.toLowerCase() })
			.getOne();
		if (sub) errors.name = "Sub exists already";
		if (Object.keys(errors).length > 0) throw errors;
	} catch (err) {
		console.error(err);
		return res.status(400).json(err);
	}

	try {
		const sub = new Sub({ name, description, title, user });
		await sub.save();

		return res.status(200).json(sub);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

const getSub = async (req: Request, res: Response) => {
	const name = req.params.name;

	try {
		const sub = await Sub.findOneOrFail({ name });
		const posts = await Post.find({
			where: { sub },
			order: { createdAt: "DESC" },
			relations: ["comments", "votes"],
		});
		sub.posts = posts;
		if (res.locals.user)
			sub.posts.forEach((p) => p.setUserVote(res.locals.user));
		return res.status(200).json(sub);
	} catch (err) {
		console.error(err);
		return res.status(404).json({ error: "Sub not found" });
	}
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
	const user = res.locals.user;

	try {
		const sub = await Sub.findOneOrFail({
			where: { name: req.params.name },
		});
		if (sub.username !== user.username) {
			return res.status(403).json({ error: "You don't own this sub" });
		}

		res.locals.sub = sub;
		return next();
	} catch (err) {
		return res.status(403).json({ error: "Something went wrong" });
	}
};

const upload = multer({
	storage: multer.diskStorage({
		destination: "public/images",
		filename: (_, file, callback) => {
			const name = makeId(15);
			callback(null, `${name}${path.extname(file.originalname)}`);
		},
	}),
	fileFilter: (_, file, callback) => {
		if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
			callback(null, true);
		} else {
			callback(new Error("File not an image"));
		}
	},
});

const uploadSubImage = async (req: Request, res: Response) => {
	const sub: Sub = res.locals.sub;

	try {
		const type = req.body.type;
		if (type !== "image" && type !== "banner") {
			return res.status(400).json({ error: "Invalid file" });
		}
		if (type === "image") sub.imageUrn = req.file.filename;
		else if (type === "banner") sub.bannerUrn = req.file.filename;
		await sub.save();
		return res.status(200).json(sub);
	} catch (err) {
		return res.status(500).json({ error: "Something went wrong" });
	}
};

const router = Router();
router.post("/", user, auth, createSub);
router.get("/:name", user, getSub);
router.post(
	"/:name/image",
	user,
	auth,
	ownSub,
	upload.single("file"),
	uploadSubImage
);
export default router;
