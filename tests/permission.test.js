const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { sequelize } = require('../models');

const app = require('../app');

let permissionPayload = {
  title: faker.person.firstName(),
  description: 'restaurant manager have access to manage the restaurant',
};

let userPayload;
let adminEmail = 'admin@gmail.com';
let adminPassword = 'Admin@1234';

let adminAccessToken;
let userAccessToken;
let permissionId;

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
  if (user.body.statusCode === 201) {
    const resp = await request(app)
      .post('/api/auth/login')
      .send({ email: userPayload.email, password: userPayload.password });
    userAccessToken =
      resp.statusCode === 200 ? resp.body.data.accessToken : null;
  }
});
describe('TEST GET api/permissions API', () => {
  it('should get all permissions', async () => {
    const res = await request(app)
      .get('/api/permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should give correct response if there is no data', async () => {
    const res = await request(app)
      .get('/api/permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ page: 10, limit: 10 });
    expect(res.statusCode).toEqual(204);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get('/api/permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ pages: 1, limit: 10 }); // pages is invalid
    expect(res.body.message).toEqual('pages is not allowed');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app)
      .get('/api/permissions')
      .query({ page: 1, limit: 10 });
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user doesn't have required permission`, async () => {
    const res = await request(app)
      .get('/api/permissions')
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });
});

describe('TEST POST api/permissions API', () => {
  it('should create a permission', async () => {
    const res = await request(app)
      .post('/api/permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(permissionPayload);
    permissionId = res.body.data.id;
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toBe(201);
  });

  it('should check if permission exist or not', async () => {
    const res = await request(app)
      .post('/api/permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(permissionPayload);
    expect(res.body.message).toEqual('permission already exists');
    expect(res.statusCode).toBe(409);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .post('/api/permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        titles: 'test_permission', // titles is invalid
        description: 'test_permission is for running test cases',
      });
    expect(res.body.message).toEqual('Title is required');
    expect(res.statusCode).toBe(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app)
      .post('/api/permissions')
      .send(permissionPayload);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toBe(401);
  });

  it(`should not allow access if the user doesn't have required permission`, async () => {
    const res = await request(app)
      .post('/api/permissions')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send(permissionPayload);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toBe(403);
  });
});

describe('TEST GET api/permissions/:permissionId API', () => {
  it('should get permission by id', async () => {
    const res = await request(app)
      .get(`/api/permissions/${permissionId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get(`/api/permissions/:${permissionId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).get(`/api/permissions/${permissionId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user doesn't have required permission`, async () => {
    const res = await request(app)
      .get(`/api/permissions/${permissionId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.Permission.destroy({
      where: {
        id: permissionId,
      },
      force: true,
    });
    const res = await request(app)
      .get(`/api/permissions/${permissionId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('permission not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST PUT api/permissions/:permissionId API', () => {
  it('should update permission by id', async () => {
    const resp = await request(app)
      .post('/api/permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(permissionPayload);

    permissionId = resp.body.data.id;

    permissionPayload.title = faker.person.firstName();
    permissionPayload.description = 'test_update_permission for testing';
    const res = await request(app)
      .put(`/api/permissions/${permissionId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(permissionPayload);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .put(`/api/permissions/:${permissionId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).put(`/api/permissions/${permissionId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user doesn't have required permission`, async () => {
    const res = await request(app)
      .put(`/api/permissions/${permissionId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.Permission.destroy({
      where: {
        id: permissionId,
      },
      force: true,
    });
    const res = await request(app)
      .put(`/api/permissions/${permissionId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(permissionPayload);
    expect(res.body.message).toEqual('permission not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST DELETE api/permissions/:permissionId API', () => {
  it('should soft delete permission by id', async () => {
    const resp = await request(app)
      .post('/api/permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(permissionPayload);

    permissionId = resp.body.data.id;

    permissionPayload.title = 'test_delete_permission';
    permissionPayload.description = 'test_delete_permission for testing';

    const res = await request(app)
      .delete(`/api/permissions/${permissionId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should hard delete permission by id', async () => {
    const resp = await request(app)
      .post('/api/permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(permissionPayload);

    permissionId = resp.body.data.id;

    permissionPayload.title = 'test_delete_permission';
    permissionPayload.description = 'test_delete_permission for testing';

    const res = await request(app)
      .delete(`/api/permissions/${permissionId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ permanentDelete: true });
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .delete(`/api/permissions/:${permissionId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).delete(`/api/permissions/${permissionId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user doesn't have required permission`, async () => {
    const res = await request(app)
      .delete(`/api/permissions/${permissionId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.Permission.destroy({
      where: {
        id: permissionId,
      },
      force: true,
    });
    const res = await request(app)
      .delete(`/api/permissions/${permissionId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('permission not exists');
    expect(res.statusCode).toEqual(404);
  });
});

afterAll(async () => {
  await sequelize.models.User.destroy({
    where: {
      email: [payload.email],
    },
    force: true,
  });
  await sequelize.models.Permission.destroy({
    where: {
      id: permissionId,
    },
    force: true,
  });
  await sequelize.close();
});
