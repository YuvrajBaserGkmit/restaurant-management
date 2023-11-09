'use strict';

/** @type {import('sequelize-cli').Migration} */

const tables = [
  'roles',
  'permissions',
  'roles_permissions',
  'users',
  'addresses',
  'users_addresses',
  'restaurants',
  'food_categories',
  'menu_items',
  'images',
  'ratings',
  'carts',
  'orders',
  'cart_items',
  'payment_methods',
  'payment_statuses',
  'payments',
];
const columns = ['created_at', 'updated_at'];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of tables) {
      for (const column of columns) {
        await queryInterface.changeColumn(table, column, {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('now()'),
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    for (const table of tables) {
      for (const column of columns) {
        await queryInterface.changeColumn(table, column, {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        });
      }
    }
  },
};
