'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1.Create the new column
    await queryInterface.addColumn("Student", "numberOfBacklogs", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 2. Backfill the data for existing students
    // Assuming 'NEVER' and 'PREVIOUS' both count as 0 active backlogs.
    await queryInterface.sequelize.query(`
      UPDATE "Student" 
      SET "numberOfBacklogs" = 0 
      WHERE "backlog" IN ('NEVER', 'PREVIOUS') 
      AND "numberOfBacklogs" IS NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Reverting the migration simply drops the column. 
    await queryInterface.removeColumn("Student", "numberOfBacklogs");
  }
};