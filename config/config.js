require('dotenv').config({ path: __dirname + '/../.env' });

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  TEST_DATABASE,
  DB_HOST,
  DB_PORT,
} = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    define: {
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: TEST_DATABASE,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    define: {
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    define: {
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },
};
