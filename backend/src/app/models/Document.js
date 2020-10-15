

module.exports = (sequelize,DataTypes) => {

    const Document = sequelize.define('Document',{
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

    Document.associate = function(models){
      Document.belongsToMany(models.User,{
        through: 'relations',
        as: 'User',
        foreingKey: 'document_id',
      });
    }
    return Document;
}