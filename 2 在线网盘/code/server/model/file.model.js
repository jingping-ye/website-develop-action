/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'file',
    {
      id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
      },
      file_name: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      hash_name: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      upload_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      size: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      download: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      uid: {
        type: DataTypes.INTEGER(10).UNSIGNED,
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
