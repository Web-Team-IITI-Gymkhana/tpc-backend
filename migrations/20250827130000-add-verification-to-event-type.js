"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (queryInterface.sequelize.getDialect() !== "postgres") {
      return;
    }
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_Event_type\" ADD VALUE IF NOT EXISTS 'VERIFICATION' BEFORE 'POLL';",
    );
  },

  async down(queryInterface, Sequelize) {
    // No-op: dropping a single value from a Postgres enum is non-trivial; leave as-is
  },
};


