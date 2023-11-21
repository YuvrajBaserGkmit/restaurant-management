'use strict';
const models = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'permissions',
      [
        { title: 'read_all_roles' },
        { title: 'create_role' },
        { title: 'read_role' },
        { title: 'update_role' },
        { title: 'delete_role' },

        { title: 'read_all_permissions' },
        { title: 'create_permission' },
        { title: 'read_permission' },
        { title: 'update_permission' },
        { title: 'delete_permission' },

        { title: 'read_all_users' },
        { title: 'create_user' },
        { title: 'read_user' },
        { title: 'update_user' },
        { title: 'delete_user' },

        { title: 'read_all_restaurants' },
        { title: 'create_restaurant' },
        { title: 'read_restaurant' },
        { title: 'update_restaurant' },
        { title: 'delete_restaurant' },

        { title: 'read_all_food_categories' },
        { title: 'create_food_category' },
        { title: 'read_food_category' },
        { title: 'update_food_category' },
        { title: 'delete_food_category' },

        { title: 'read_all_menu_items' },
        { title: 'create_menu_item' },
        { title: 'read_menu_item' },
        { title: 'update_menu_item' },
        { title: 'delete_menu_item' },

        { title: 'read_all_images' },
        { title: 'create_image' },
        { title: 'read_image' },
        { title: 'update_image' },
        { title: 'delete_image' },

        { title: 'read_all_ratings' },
        { title: 'create_rating' },
        { title: 'read_rating' },
        { title: 'update_rating' },
        { title: 'delete_rating' },

        { title: 'read_all_orders' },
        { title: 'create_order' },
        { title: 'read_order' },
        { title: 'update_order' },
        { title: 'delete_order' },

        { title: 'read_all_carts' },
        { title: 'create_cart' },
        { title: 'read_cart' },
        { title: 'update_cart' },
        { title: 'delete_cart' },

        { title: 'read_all_payment_methods' },
        { title: 'create_payment_method' },
        { title: 'read_payment_method' },
        { title: 'update_payment_method' },
        { title: 'delete_payment_method' },

        { title: 'read_all_payment_statuses' },
        { title: 'create_payment_status' },
        { title: 'read_payment_status' },
        { title: 'update_payment_status' },
        { title: 'delete_payment_status' },

        { title: 'read_all_payments' },
        { title: 'create_payment' },
        { title: 'read_payment' },
        { title: 'update_payment' },
        { title: 'delete_payment' },

        { title: 'assign_permissions_to_role' },
        { title: 'remove_permission_from_role' },
      ],
      { returning: true },
    );

    const role = await models.Role.findOne({
      where: {
        title: 'admin',
      },
    });
    const permissions = await models.Permission.findAll();

    for (const permission of permissions) {
      await queryInterface.bulkInsert('roles_permissions', [
        {
          role_id: role.id,
          permission_id: permission.id,
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles_permissions', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
