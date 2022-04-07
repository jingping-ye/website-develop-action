/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'user',
    {
      uid: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    },
    {
      tableName: 'user'
    }
  );
};
