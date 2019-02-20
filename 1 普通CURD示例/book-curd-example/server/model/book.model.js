/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'book',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      isbn: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      author: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      print: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      publish_time: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      intro: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      remark: {
        type: DataTypes.STRING(200),
        allowNull: true
      }
    },
    {
      tableName: 'book'
    }
  );
};
