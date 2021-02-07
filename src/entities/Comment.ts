import { Exclude } from "class-transformer";
import {
	BeforeInsert,
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from "typeorm";
import { makeId } from "../utils/helpers";
import { EntityModel } from "./EntityModel";
import { Post } from "./Post";
import { User } from "./User";
import { Vote } from "./Vote";

@Entity("comments")
export class Comment extends EntityModel {
	constructor(comment: Partial<Comment>) {
		super();
		Object.assign(this, comment);
	}

	@Index()
	@Column()
	identifier: string;

	@Column()
	body: string;

	@Column()
	username: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: "username", referencedColumnName: "username" })
	user: User;

	@ManyToOne(() => Post, (post) => post.comments, { nullable: false })
	post: Post;

	@Exclude()
	@OneToMany(() => Vote, (vote) => vote.comment)
	votes: Vote[];

	protected userVote: number;
	setUserVote(user: User) {
		const index = this.votes?.findIndex((v) => v.username === user.username);
		this.userVote = index > -1 ? this.votes[index].value : 0;
	}

	@BeforeInsert()
	makeIdentifier() {
		this.identifier = makeId(8);
	}
}
