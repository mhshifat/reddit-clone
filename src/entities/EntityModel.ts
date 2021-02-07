import { classToPlain, Exclude } from "class-transformer";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class EntityModel extends BaseEntity {
	@Exclude()
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@CreateDateColumn()
	updatedAt: Date;

	toJSON() {
		return classToPlain(this);
	}
}
