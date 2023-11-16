'use strict';

/** @type {import('sequelize-cli').Migration} */

const columns = ['created_at', 'updated_at'];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('roles', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('roles', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('permissions', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('permissions', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('roles_permissions', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('roles_permissions', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('users', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('users', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('addresses', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('addresses', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('users_addresses', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('users_addresses', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('restaurants', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('restaurants', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('food_categories', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('food_categories', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('menu_items', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('menu_items', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('images', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('images', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('ratings', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('ratings', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('carts', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('carts', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('orders', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('orders', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('cart_items', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('cart_items', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('payment_methods', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('payment_methods', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('payment_statuses', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('payment_statuses', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('payments', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
    await queryInterface.changeColumn('payments', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('now()'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(table, column, {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });

    await queryInterface.changeColumn('roles', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('roles', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('permissions', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('permissions', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('roles_permissions', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('roles_permissions', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('users', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('users', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('addresses', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('addresses', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('users_addresses', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('users_addresses', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('restaurants', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('restaurants', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('food_categories', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('food_categories', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('menu_items', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('menu_items', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('images', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('images', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('ratings', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('ratings', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('carts', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('carts', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('orders', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('orders', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('cart_items', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('cart_items', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('payment_methods', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('payment_methods', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('payment_statuses', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('payment_statuses', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('payments', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.changeColumn('payments', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
  },
};
