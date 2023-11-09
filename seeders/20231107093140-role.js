'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          title: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          title: 'owner',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          title: 'customer',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
