'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const result = await queryInterface.sequelize.query(
      `SELECT * FROM roles WHERE title='admin'`,
    );
    const email = 'admin@gmail.com';
    const password = await bcrypt.hash('Admin@1234', 10);
    let payload = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: email,
      phone_number: faker.number
        .int({ min: 1000000000, max: 9999999999 })
        .toString(),
      password: password,
      role_id: result[0][0].id,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await queryInterface.bulkInsert('users', [payload], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
