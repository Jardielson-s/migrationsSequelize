'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('relations',{
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false
    },

    UserId: {
      type: Sequelize.INTEGER,
      references: {model: 'users',key: 'id'},
      onDelete: 'CASCADE',
      allowNull: false,
    },

    PeopleId: {
      type: Sequelize.INTEGER,
      references: {model: 'peoples',key: 'id'},
      onDelete: 'CASCADE',
      allowNull: false,
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    }

  })
,
  down: async queryInterface => queryInterface.dropTable('relations')
};
