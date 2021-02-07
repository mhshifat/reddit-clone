import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Comment } from "./Comment";
import { EntityModel } from "./EntityModel";
import { Post } from "./Post";
import { User } from "./User";

@Entity("votes")
export class Vote extends EntityModel {
	constructor(vote: Partial<Vote>) {
		super();
		Object.assign(this, vote);
	}

	@Column()
	value: number;

	@Column()
	username: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: "username", referencedColumnName: "username" })
	user: User;

	@ManyToOne(() => Post)
	post: Post;

	@ManyToOne(() => Comment)
	comment: Comment;
}
