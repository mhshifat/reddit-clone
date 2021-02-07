import bcrypt from "bcryptjs";
import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator";
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import { EntityModel } from "./EntityModel";
import { Post } from "./Post";
import { Vote } from "./Vote";

@Entity("users")
export class User extends EntityModel {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}

	@Index()
	@Length(3, 255, { message: "Must be at least 3 characters long" })
	@Column({ unique: true })
	username: string;

	@Index()
	@IsEmail(undefined, { message: "Must be a valid email address" })
	@Length(1, 255, { message: "Email is empty" })
	@Column({ unique: true })
	email: string;

	@Exclude()
	@Length(5, 255, { message: "Must be at least 5 characters long" })
	@Column()
	password: string;

	@OneToMany(() => Post, (post) => post.user)
	posts: Post[];

	@OneToMany(() => Vote, (vote) => vote.user)
	votes: Vote[];

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10);
	}
}
