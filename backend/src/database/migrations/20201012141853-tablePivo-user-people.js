'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>{
    return queryInterface.createTable('relations',{
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false
    },

    document_id: {
      type: Sequelize.INTEGER,
      references: {model: 'documents',key: 'id'},
      onDelete: 'CASCADE',
      allowNull: false,
    },

    user_id: {
      type: Sequelize.INTEGER,
      references: {model: 'users',key: 'id'},
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
}
,
  down: async queryInterface => {
    return queryInterface.dropTable('relations')
  }
};
