'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RecruiterFeedback", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      /* ---------- Recruiter ---------- */
      recruiterId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Recruiter",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      /* ---------- Company ---------- */
      companyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Company",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      /* ---------- Season ---------- */
      seasonId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Season",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      /* ---------- Ratings ---------- */
      communicationPromptness: {
        type: Sequelize.INTEGER,
      },
      queryHandling: {
        type: Sequelize.INTEGER,
      },
      logisticsArrangement: {
        type: Sequelize.INTEGER,
      },
      studentFamiliarity: {
        type: Sequelize.INTEGER,
      },
      studentCommunication: {
        type: Sequelize.INTEGER,
      },
      resumeQuality: {
        type: Sequelize.INTEGER,
      },
      studentPreparedness: {
        type: Sequelize.INTEGER,
      },
      disciplineAndPunctuality: {
        type: Sequelize.INTEGER,
      },

      /* ---------- Other ---------- */
      rightTimeToContact: {
        type: Sequelize.STRING,
      },
      recommendations: {
        type: Sequelize.TEXT,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    /* ---------- UNIQUE CONSTRAINT ---------- */
    await queryInterface.addConstraint("RecruiterFeedback", {
      fields: ["recruiterId", "seasonId"],
      type: "unique",
      name: "unique_recruiter_feedback_per_season",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("RecruiterFeedback");
  },
};
