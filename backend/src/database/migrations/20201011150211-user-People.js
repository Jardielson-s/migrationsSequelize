'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>{
     return queryInterface.createTable('documents',{
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false
    },

    cpf: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    number_account: {
      type: Sequelize.STRING,
      allowNull: false
    },

    balance: {
       type: Sequelize.INTEGER,
       allowNull: false,
    },

    location: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },

  })
    
},

down: queryInterface => {
  return queryInterface.dropTable('documents');
},

}
