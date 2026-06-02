import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("noticeboard")
export class Noticeboard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 255,
    })
    clubname: string;

    @Column({
        type: "varchar",
        length: 500,
    })
    heading: string;

    @Column({
        type: "text",
    })
    info: string;

    @Column({
        type: "text",
        nullable: true,
    })
    announcelogo: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: true,
        default: "all",
    })
    group: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}