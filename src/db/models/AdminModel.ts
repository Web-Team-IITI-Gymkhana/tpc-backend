import {
    Column,
    DataType,
    Model,
    Table,
    BeforeCreate,
    BeforeUpdate,
} from "sequelize-typescript";

@Table({
    tableName: "admins",
    timestamps: true,
})
export class AdminModel extends Model<AdminModel> {
    @BeforeCreate
    @BeforeUpdate
    static lowercaseEmail(instance: AdminModel) {
        if (instance.email) {
            instance.email = instance.email.trim().toLowerCase();
        }
    }

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email: string;
}