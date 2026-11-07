module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Resume", "verifiedby", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "User", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Resume", "verifiedby");
  },
};
