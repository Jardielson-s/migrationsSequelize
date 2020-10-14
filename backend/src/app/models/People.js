

module.exports = (sequelize,DataTypes) => {

    const People = sequelize.define('People',{
        cpf: {
            type: DataTypes.STRING,
            validate: {
                len: [9-15]
            }
        },

        number_account: {
            type: DataTypes.STRING,
          },
      
          balance: {
             type: DataTypes.INTEGER,
             defaultValue: 0
          },
      
          location: {
            type: DataTypes.TEXT,
          },
      
          phone: {
            type: DataTypes.STRING,
          }
    });

    People.associate = function(models){
      People.belongsToMany(models.User,{
        through: 'relations',
        foreingKey: 'PeopleId',
        as: 'User'
      });
    }
    return People;
}