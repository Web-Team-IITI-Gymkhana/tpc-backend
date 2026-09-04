"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (queryInterface.sequelize.getDialect() !== "postgres") {
      return;
    }
    const newDomains = [
      "Semiconductors/Electronics",
      "Automotive/Manufacturing/Engineering",
      "IT/ITES",
      "Analytics/Consulting",
      "Banking/Financial services/Investment Banking",
      "Healthcare/Education/Others",
      "Oil & Gas/Energy",
    ];

    for (const domain of newDomains) {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Company_domains" ADD VALUE IF NOT EXISTS '${domain}';`
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // No-op: Postgres does not support removing individual values from an enum type
    // without dropping and recreating it.
    console.warn(
      "down() is a no-op for enum additions — new domains remain in enum_Company_domains."
    );
  },
};
