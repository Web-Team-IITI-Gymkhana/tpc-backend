"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (queryInterface.sequelize.getDialect() !== "postgres") {
      return;
    }
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_OnCampusOffer_status\" ADD VALUE IF NOT EXISTS 'PPO_ACCEPTED';"
    );
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_OnCampusOffer_status\" ADD VALUE IF NOT EXISTS 'PLACEMENT_FTE';"
    );
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_OnCampusOffer_status\" ADD VALUE IF NOT EXISTS 'PLACEMENT_PPO';"
    );
  },

  async down(queryInterface, Sequelize) {
    // No-op: Postgres does not support removing individual values from an enum type
    // without dropping and recreating it, which would require migrating all dependent data.
    console.warn(
      "down() is a no-op for enum additions — PPO_ACCEPTED, PLACEMENT_FTE, and PLACEMENT_PPO remain in enum_OnCampusOffer_status."
    );
  },
};
