import { Expose } from "class-transformer";
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from "typeorm";
import { EntityModel } from "./EntityModel";
import { Post } from "./Post";
import { User } from "./User";

@Entity("subs")
export class Sub extends EntityModel {
	constructor(sub: Partial<Sub>) {
		super();
		Object.assign(this, sub);
	}

	@Index()
	@Column({ unique: true })
	name: string;

	@Column()
	title: string;

	@Column({ type: "text", nullable: true })
	description: string;

	@Column({ nullable: true })
	imageUrn: string;

	@Column({ nullable: true })
	bannerUrn: string;

	@Column()
	username: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: "username", referencedColumnName: "username" })
	user: User;

	@OneToMany(() => Post, (post) => post.sub)
	posts: Post[];

	@Expose()
	get imageUrl(): string {
		return this.imageUrn
			? `${process.env.API_URL}/images/${this.imageUrn}`
			: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
	}

	@Expose()
	get bannerUrl(): string | undefined {
		return this.bannerUrn
			? `${process.env.API_URL}/images/${this.bannerUrn}`
			: undefined;
	}
}
