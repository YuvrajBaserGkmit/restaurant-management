const request = require('supertest');
const { faker } = require('@faker-js/faker');

const { sequelize } = require('../models');
const app = require('../app');

let user;
let accessToken;
let refreshToken;
let email;
let password;

beforeAll(async () => {
  const title = 'customer';
  const role = await sequelize.models.Role.findOne({ where: { title } });

  userPayload = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    phoneNumber: faker.number
      .int({ min: 1000000000, max: 9999999999 })
      .toString(),
    password: faker.internet.password(),
    roleId: role.id,
  };

  user = await request(app).post('/api/users').send(userPayload);
  email = user.body.data.email;
  password = userPayload.password;
});

describe('TEST POST api/auth/login API', () => {
  it('should log in a user with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: email,
      password: password,
    });
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('should not log in a user with incorrect credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: email,
      password: 'wrongPassword',
    });
    expect(res.body.message).toEqual('wrong email or password');
    expect(res.statusCode).toEqual(401);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app).post('/api/auth/login').send({
      emails: email,
      password: password,
    });
    expect(res.body.message).toEqual('Email is required');
    expect(res.statusCode).toEqual(400);
  });

  it('should check if user exist or not', async () => {
    const testEmail = 'test.email@gmail.com';
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: password,
    });
    expect(res.body.message).toEqual(`user with email ${testEmail} not exists`);
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST POST api/auth/refresh-token API', () => {
  it('should return new access token', async () => {
    const res = await request(app).post('/api/auth/refresh-token').send({
      refreshToken: refreshToken,
    });
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app).post('/api/auth/refresh-token').send({
      refresh: refreshToken, // key should be refreshToken
    });
    expect(res.body.message).toEqual('Refresh Token is required');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow incorrect credentials', async () => {
    const res = await request(app).post('/api/auth/refresh-token').send({
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMjI5YTIwOS1hMDEwLTRmNDUtOGMyZi0zMjA5MjQzODIwZmIiLCJpYXQiOjE3MDA3MTk4NTksImV4cCI6MTcwMzMxMTg1OX0.gIhP5LGroLuqoWeQNEyw29wGzCKbcI_W32bKAmURt9d',
    });
    expect(res.body.message).toEqual('invalid signature');
    expect(res.statusCode).toEqual(401);
  });

  it('should check if user exist or not', async () => {
    const res = await request(app).post('/api/auth/refresh-token').send({
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMjI5YTIwOS1hMDEwLTRmNDUtOGMyZi0zMjA5MjQzODIwZmIiLCJpYXQiOjE3MDA3MTk4NTksImV4cCI6MTcwMzMxMTg1OX0.gIhP5LGroLuqoWeQNEyw29wGzCKbcI_W32bKAmURt9c',
    });
    expect(res.body.message).toEqual('User Not found');
    expect(res.statusCode).toEqual(404);
  });
});

afterAll(async () => {
  await sequelize.models.Customer.destroy({ where: { email }, force: true });
  await sequelize.close();
});
