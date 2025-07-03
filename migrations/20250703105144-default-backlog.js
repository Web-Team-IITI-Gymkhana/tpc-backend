"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // Remove default value from backlog column
    const BacklogEnum = { NEVER: "NEVER", PREVIOUS: "PREVIOUS", ACTIVE: "ACTIVE" };
    await queryInterface.changeColumn("Student", "backlog", {
      type: Sequelize.ENUM.apply(null, Object.values(BacklogEnum)),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // Restore default value to backlog column
    const BacklogEnum = { NEVER: "NEVER", PREVIOUS: "PREVIOUS", ACTIVE: "ACTIVE" };
    await queryInterface.changeColumn("Student", "backlog", {
      type: Sequelize.ENUM.apply(null, Object.values(BacklogEnum)),
      allowNull: true,
      defaultValue: BacklogEnum.NEVER,
    });
  },
};
