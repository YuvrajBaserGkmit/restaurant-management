const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { sequelize } = require('../models');
const app = require('../app');

let adminEmail = 'admin@gmail.com';
let adminPassword = 'Admin@1234';

let userPayload;
let addressId;

let adminAccessToken;
let userAccessToken;

let addressesToBeDeleted = [];

beforeAll(async () => {
  const resp = await request(app)
    .post('/api/auth/login')
    .send({ email: adminEmail, password: adminPassword });
  adminAccessToken =
    resp.statusCode === 200 ? resp.body.data.accessToken : null;

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

describe('TEST GET api/addresses API', () => {
  beforeAll(async () => {
    await sequelize.models.Address.create({
      street: '100 feet road, Shobagpura',
      city: 'Udaipur',
      state: 'Rajasthan',
      pin_code: 458001,
      is_default: true,
    });
  });
  it('should get all addresses', async () => {
    const res = await request(app)
      .get('/api/addresses')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ page: 1, limit: 5 });
    addressesToBeDeleted.push(res.body.data.id);

    expect(res.body.message).toBe('Success');
    expect(res.statusCode).toBe(200);
  });

  it('should give correct response if there is no data', async () => {
    const res = await request(app)
      .get('/api/addresses')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ page: 100, limit: 5 });

    expect(res.statusCode).toBe(204);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get('/api/addresses')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .query({ page: 1, limit: 5 });

    expect(res.body.message).toBe(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toBe(403);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app)
      .get('/api/addresses')
      .query({ pages: 100, limit: 5 });

    expect(res.body.message).toBe('Access denied');
    expect(res.statusCode).toBe(401);
  });
});

describe('TEST POST api/addresses API', () => {
  let payload;
  beforeAll(() => {
    payload = {
      street: '100 feet road, Shobhagpura',
      city: 'Udaipur',
      state: 'RJ',
      pinCode: faker.string.numeric(6),
      isDefault: true,
    };
  });
  it('should create an address', async () => {
    const res = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    addressesToBeDeleted.push(res.body.data.id);
    addressId = res.body.data.id;

    expect(res.body.message).toBe('Success');
    expect(res.statusCode).toBe(201);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        street: '100 feet road, Shobagpura',
        city: 'Udaipur',
        state: 'Rajasthan',
        pinCode: '458001',
      });

    expect(res.body.message).toBe('Is Default is required');
    expect(res.statusCode).toBe(400);
  });

  it('should check if user already has an address', async () => {
    const res = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    addressesToBeDeleted.push(res.body.data.id);

    expect(res.body.message).toBe('Address already exists');
    expect(res.statusCode).toBe(409);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).post('/api/addresses').send(payload);
    addressesToBeDeleted.push(res.body.data.id);

    expect(res.body.message).toBe('Access denied');
    expect(res.statusCode).toBe(401);
  });
});

describe('TEST GET api/addresses/:addressId API', () => {
  it('should get address by id', async () => {
    const res = await request(app)
      .get(`/api/addresses/${addressId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get(`/api/addresses/${addressId}:`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).get(`/api/addresses/${addressId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it('should check if the requested address exists or not', async () => {
    await sequelize.models.Address.destroy({ where: { id: addressId } });
    const res = await request(app)
      .get(`/api/addresses/${addressId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Address not found');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST PUT api/addresses/:addressId API', () => {
  let payload;
  beforeAll(async () => {
    payload = {
      street: '100 feet road, Shobhagpura',
      city: 'Udaipur',
      state: 'RJ',
      pinCode: faker.string.numeric(6),
      isDefault: true,
    };
    const res = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    addressesToBeDeleted.push(res.body.data.id);
    addressId = res.body.data.id;
  });
  it('should update address by id', async () => {
    const res = await request(app)
      .put(`/api/addresses/${addressId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .put(`/api/addresses/${addressId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ street: '100 feet road, Shobhagpura' });
    expect(res.body.message).toEqual('City is required');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app)
      .put(`/api/addresses/${addressId}`)
      .send(payload);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it('should check if the requested address exists or not', async () => {
    await sequelize.models.Address.destroy({ where: { id: addressId } });
    const res = await request(app)
      .put(`/api/addresses/${addressId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    expect(res.body.message).toEqual('Address not found');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST DELETE api/addresses/:addressId API', () => {
  let payload;
  let id;
  beforeAll(async () => {
    payload = {
      street: '100 feet road, Shobhagpura',
      city: 'Udaipur',
      state: 'RJ',
      pinCode: faker.string.numeric(6),
      isDefault: true,
    };
    addressDeletePayload = {
      street: '100 feet road, Shobhagpura',
      city: 'Udaipur',
      state: 'RJ',
      pinCode: faker.string.numeric(6),
      isDefault: true,
    };
    const res = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    const address = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(addressDeletePayload);
    addressesToBeDeleted.push(res.body.data.id);
    addressId = res.body.data.id;
    id = address.body.data.id;
  });
  it('should soft delete address by id', async () => {
    const res = await request(app)
      .delete(`/api/addresses/${addressId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .delete(`/api/addresses/${addressId}:`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).delete(`/api/addresses/${addressId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it('should check if the requested address exists or not', async () => {
    const res = await request(app)
      .delete(`/api/addresses/${addressId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Address not found');
    expect(res.statusCode).toEqual(404);
  });
});

afterAll(async () => {
  await sequelize.models.User.destroy({ where: { id: user.id } });
  await sequelize.models.User.destroy({ where: { id: addressesToBeDeleted } });
});
