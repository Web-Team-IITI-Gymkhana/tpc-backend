module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Job", "location", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Job", "location", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};

