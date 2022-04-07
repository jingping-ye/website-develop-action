/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'file',
    {
      id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      hash_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      upload_time: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      size: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      download: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      uid: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        references: {
          model: 'user',
          key: 'uid'
        }
      }
    },
    {
      tableName: 'file'
    }
  );
};
