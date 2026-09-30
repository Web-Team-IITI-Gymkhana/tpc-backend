module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Resume", "verifiedById", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Resume", "verifiedById");
  },
};
