'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      this.belongsTo(models.MenuItem, {
        foreignKey: 'menu_item_id',
      });
    }
  }
  Image.init(
    {
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      menu_item_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'menu_items',
        },
      },
    },
    {
      sequelize,
      modelName: 'Image',
      tableName: 'images',
      paranoid: true,
    },
  );
  return Image;
};
