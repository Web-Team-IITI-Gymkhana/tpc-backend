import {
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";

@Table({
    tableName: "noticeboard",
    timestamps: true,
})
export class NoticeboardModel extends Model<NoticeboardModel> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    clubname: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    heading: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    info: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    announcelogo: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "all",
    })
    group: string;
}