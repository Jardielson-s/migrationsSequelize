

module.exports = (sequelize,DataTypes)=>{
    const User = sequelize.define('User', {
        name: {
         type: DataTypes.STRING,
         allowNull: false
        },
          email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      });
    
    User.associate = function(models) {
      User.belongsToMany(models.People,{
        through: 'relations',
        foreignKey: 'UserId', 
        as: 'People'
      })
    }



      User.prototype.toJSON= function(){
        var values = Object.assign({},this.get());

        delete values.password;

        return values;
      }

    return User;
}