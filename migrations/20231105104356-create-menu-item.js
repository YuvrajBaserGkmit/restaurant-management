'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menu_items', {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_veg: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      restaurant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'restaurants',
        },
      },
      food_category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'food_categories',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('menu_items');
  },
};
