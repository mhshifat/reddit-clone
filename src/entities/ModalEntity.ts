import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ModalEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;
}
