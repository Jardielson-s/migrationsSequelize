module.exports = {
  development: {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'root@123',
    database: 'users',
    operatorAliases: false,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
}