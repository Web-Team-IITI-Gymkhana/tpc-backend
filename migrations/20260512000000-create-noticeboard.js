"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("noticeboard", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            clubname: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            heading: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            info: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            announcelogo: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            group: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("noticeboard");
    },
};