import {
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";

@Table({
    tableName: "admins",
    timestamps: true,
})
export class AdminModel extends Model<AdminModel> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email: string;
}