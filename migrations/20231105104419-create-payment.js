'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        type: Sequelize.UUID,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      payment_status_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          key: 'id',
          model: 'payment_statuses',
        },
      },
      payment_method_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          key: 'id',
          model: 'payment_methods',
        },
      },
      order_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          key: 'id',
          model: 'orders',
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
    await queryInterface.dropTable('payments');
  },
};
