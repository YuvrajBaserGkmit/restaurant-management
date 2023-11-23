const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { sequelize } = require('../models');

const app = require('../app');

let userPayload;
let adminEmail = 'admin@gmail.com';
let adminPassword = 'Admin@1234';

let adminAccessToken;
let userAccessToken;
let userId;

let usersToBeDeleted = [];

beforeAll(async () => {
  const admin = await sequelize.models.User.findOne({
    where: { email: adminEmail },
  });
  if (admin) {
    const resp = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: adminPassword });
    adminAccessToken =
      resp.statusCode === 200 ? resp.body.data.accessToken : null;
  }

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

  const user = await request(app).post('/api/users').send(userPayload);
  usersToBeDeleted.push(user.body.data.email);
  userId = user.body.data.id;
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
    usersToBeDeleted.push(userPayload.email);

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);

    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toBe(201);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phoneNumber: faker.number
          .int({ min: 1000000000, max: 9999999999 })
          .toString(),
        password: faker.internet.password(),
      });
    expect(res.body.message).toEqual('Role Id is required');
    expect(res.statusCode).toBe(400);
  });

  it('should check if role exists or not', async () => {
    roleId = '1ab495de-7993-4812-9f83-ab06fc57908a';

    const payload = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      phoneNumber: faker.number
        .int({ min: 1000000000, max: 9999999999 })
        .toString(),
      password: faker.internet.password(),
      roleId: roleId,
    };
    usersToBeDeleted.push(payload.email);

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);

    expect(res.body.message).toEqual('Role does not exist');
    expect(res.statusCode).toBe(404);
  });

  it('should check if user already', async () => {
    userPayload.email = adminEmail;

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);

    expect(res.body.message).toEqual('User already exists');
    expect(res.statusCode).toBe(409);
  });

  it('should not allow admin role', async () => {
    const title = 'admin';
    const role = await sequelize.models.Role.findOne({ where: { title } });

    const payload = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      phoneNumber: faker.number
        .int({ min: 1000000000, max: 9999999999 })
        .toString(),
      password: faker.internet.password(),
      roleId: role.id,
    };

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);

    expect(res.body.message).toEqual('admin role not allowed');
    expect(res.statusCode).toBe(422);
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
    const id = 'f5ab3a7c-802e-4ff5-98e9-f84b6194e1fb';

    const res = await request(app)
      .get(`/api/users/${id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('User not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST PUT api/users/:userId API', () => {
  it('should update user by id', async () => {
    userPayload.email = faker.internet.email().toLowerCase();
    usersToBeDeleted.push(userPayload.email);

    const resp = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);

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
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);
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
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send(userPayload);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should check if the request resource is present or not', async () => {
    const id = 'f5ab3a7c-802e-4ff5-98e9-f84b6194e1fb';

    const res = await request(app)
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);
    expect(res.body.message).toEqual('User not exists');
    expect(res.statusCode).toEqual(404);
  });

  it('should not allow admin role', async () => {
    const title = 'admin';
    const role = await sequelize.models.Role.findOne({ where: { title } });

    const payload = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      phoneNumber: faker.number
        .int({ min: 1000000000, max: 9999999999 })
        .toString(),
      password: faker.internet.password(),
      roleId: role.id,
    };

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);

    expect(res.body.message).toEqual('admin role not allowed');
    expect(res.statusCode).toBe(422);
  });
});

describe('TEST DELETE api/users/:userId API', () => {
  it('should soft delete user by id', async () => {
    userPayload.email = faker.internet.email().toLowerCase();
    const resp = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);

    userId = resp.body.data.id;

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should hard delete user by id', async () => {
    userPayload.email = faker.internet.email().toLowerCase();
    const resp = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(userPayload);

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
    const test = await sequelize.models.User.destroy({
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
  await sequelize.models.User.destroy({
    where: {
      email: usersToBeDeleted,
    },
    force: true,
  });
  await sequelize.close();
});
