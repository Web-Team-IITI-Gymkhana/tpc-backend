"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    if (queryInterface.sequelize.getDialect() !== "postgres") {
      return;
    }

    await queryInterface.sequelize.query('ALTER TYPE "enum_Program_course" ADD VALUE IF NOT EXISTS \'MA\';');
  },

  async down() {
    // PostgreSQL cannot remove an individual enum value without recreating the type.
  },
};
