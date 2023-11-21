const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { sequelize } = require('../models');

const app = require('../app');

let userPayload = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  phoneNumber: faker.number
    .int({ min: 1000000000, max: 9999999999 })
    .toString(),
  password: faker.internet.password(),
  role: 'customer',
};

let customerEmails = [];
customerEmails.push(userPayload.email);
let adminEmail = 'admin@gmail.com';
let adminPassword = 'Admin@1234';

let adminAccessToken;
let userAccessToken;
let userId;

beforeAll(async () => {
  const admin = await sequelize.models.User.findOne({
    where: {
      email: adminEmail,
    },
  });

  const user = await request(app).post('/api/users').send(userPayload);

  if (admin) {
    const resp = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: adminPassword });
    adminAccessToken =
      resp.statusCode === 200 ? resp.body.data.accessToken : null;
  }

  if (user.body.statusCode === 201) {
    const resp = await request(app)
      .post('/api/auth/login')
      .send({ email: userPayload.email, password: userPayload.password });
    userAccessToken =
      resp.statusCode === 200 ? resp.body.data.accessToken : null;
  }
});

describe('TEST GET api/users API', () => {
  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should give correct response if there is no data', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ page: 10, limit: 10 });
    expect(res.statusCode).toEqual(204);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ pages: 1, limit: 10 });
    expect(res.body.message).toEqual('pages is not allowed');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).get('/api/users');
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user don't have required permission`, async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });
});

describe('TEST POST api/users API', () => {
  it('should create a user', async () => {
    userPayload.email = faker.internet.email().toLowerCase();
    customerEmails.push(userPayload.email);

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);

    userId = res.body.data.id;
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toBe(201);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        firstNames: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phoneNumber: faker.number
          .int({ min: 1000000000, max: 9999999999 })
          .toString(),
        password: faker.internet.password(),
        role: 'customer',
      });
    expect(res.body.message).toEqual('First Name is required');
    expect(res.statusCode).toBe(400);
  });
});

describe('TEST GET api/users/:userId API', () => {
  it('should get user by id', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get(`/api/users/:${userId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user don't have required permission`, async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.User.destroy({
      where: {
        id: userId,
      },
      force: true,
    });
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('User not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST PUT api/users/:userId API', () => {
  it('should update user by id', async () => {
    const resp = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);
    customerEmails.push(userPayload.email);

    userId = resp.body.data.id;
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .put(`/api/users/:${userId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).put(`/api/users/${userId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user don't have required permission`, async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.User.destroy({
      where: {
        id: userId,
      },
      force: true,
    });
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);
    expect(res.body.message).toEqual('User not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST DELETE api/users/:userId API', () => {
  it('should soft delete user by id', async () => {
    const resp = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);
    customerEmails.push(userPayload.email);

    userId = resp.body.data.id;

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should hard delete user by id', async () => {
    const resp = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);
    customerEmails.push(userPayload.email);

    userId = resp.body.data.id;

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ permanentDelete: true });
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .delete(`/api/users/:${userId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).put(`/api/users/${userId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user don't have required permission`, async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.User.destroy({
      where: {
        id: userId,
      },
      force: true,
    });
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('User not exists');
    expect(res.statusCode).toEqual(404);
  });
});

afterAll(async () => {
  customerEmails.push(userPayload.email);
  await sequelize.models.User.destroy({
    where: {
      email: customerEmails,
    },
    force: true,
  });
  await sequelize.close();
});
