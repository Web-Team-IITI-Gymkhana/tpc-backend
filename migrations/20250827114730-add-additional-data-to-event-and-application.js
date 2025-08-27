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
    
    // Add additionalData column to Event table
    await queryInterface.addColumn("Event", "additionalData", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    });

    // Ensure Event.type enum includes VERIFICATION
    // Note: Enum alteration differs per dialect; this covers Postgres
    if (queryInterface.sequelize.getDialect() === "postgres") {
      await queryInterface.sequelize.query(
        "ALTER TYPE \"enum_Event_type\" ADD VALUE IF NOT EXISTS 'VERIFICATION';",
      );
    }

    // Add additionalData column to Application table
    await queryInterface.addColumn("Application", "additionalData", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    
    // Remove additionalData column from Event table
    await queryInterface.removeColumn("Event", "additionalData");

    // Remove additionalData column from Application table
    await queryInterface.removeColumn("Application", "additionalData");
  },
};
