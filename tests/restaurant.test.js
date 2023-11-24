const request = require('supertest');
const { faker, fa } = require('@faker-js/faker');
const { sequelize } = require('../models');

const app = require('../app');

let adminAccessToken;

beforeAll(async () => {
  const admin = await sequelize.models.User.findOne({
    where: {
      email: 'admin@gmail.com',
    },
  });

  if (admin) {
    const resp = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@gmail.com', password: 'Admin@1234' });
    adminAccessToken =
      resp.statusCode === 200 ? resp.body.data.accessToken : null;
  }
});

describe('TEST POST api/restaurants API', () => {
  let payload;
  beforeAll(async () => {
    payload = {
      name: faker.company.name(),
      address: {
        street: '100 feet road, Shobhagpura',
        city: 'Udaipur',
        state: 'Rajasthan',
        pinCode: 458001,
      },
    };
  });

  it('should create a restaurant', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);

    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toBe(201);
  });

  it('should create a restaurant', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);

    expect(res.body.message).toEqual('Restaurant already exists');
    expect(res.statusCode).toBe(409);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        names: faker.company.name(),
        addresses: faker.address.streetAddress(),
      });
    expect(res.body.message).toEqual('Name is required');
    expect(res.statusCode).toBe(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).post('/api/restaurants').send(payload);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toBe(401);
  });
});

describe('TEST GET api/restaurants API', () => {
  it('should get all restaurants', async () => {
    const res = await request(app)
      .get('/api/restaurants')
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should give correct response if there is no data', async () => {
    const res = await request(app)
      .get('/api/restaurants')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ page: 10, limit: 10 });
    expect(res.statusCode).toEqual(204);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get('/api/restaurants')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ pages: 1, limit: 10 }); // pages is invalid
    expect(res.body.message).toEqual('pages is not allowed');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app)
      .get('/api/restaurants')
      .query({ page: 1, limit: 10 });
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });
});

describe('TEST GET api/restaurants/:restaurantId API', () => {
  let restaurantId;
  let payload;

  beforeAll(async () => {
    payload = {
      name: faker.company.name(),
      address: {
        street: '100 feet road, Shobhagpura',
        city: 'Udaipur',
        state: 'Rajasthan',
        pinCode: 458001,
      },
    };
    const resp = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);

    restaurantId = resp.body.data.id;
  });

  it('should get restaurant by id', async () => {
    const res = await request(app)
      .get(`/api/restaurants/${restaurantId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get(`/api/restaurants/:${restaurantId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).get(`/api/restaurants/${restaurantId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.Restaurant.destroy({
      where: {
        id: restaurantId,
      },
      force: true,
    });
    const res = await request(app)
      .get(`/api/restaurants/${restaurantId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('restaurant not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST PUT api/restaurants/:restaurantId API', () => {
  let restaurantId;
  let payload;

  beforeAll(async () => {
    payload = {
      name: faker.company.name(),
      address: {
        street: '100 feet road, Shobhagpura',
        city: 'Udaipur',
        state: 'Rajasthan',
        pinCode: 458001,
      },
    };
    const resp = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);

    restaurantId = resp.body.data.id;
  });

  it('should update restaurant by id', async () => {
    const res = await request(app)
      .put(`/api/restaurants/${restaurantId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .put(`/api/restaurants/:${restaurantId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).put(`/api/restaurants/${restaurantId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.Restaurant.destroy({
      where: {
        id: restaurantId,
      },
      force: true,
    });
    const res = await request(app)
      .put(`/api/restaurants/${restaurantId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    expect(res.body.message).toEqual('Restaurant not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST DELETE api/restaurants/:restaurantId API', () => {
  let restaurantId;
  let payload;

  beforeAll(async () => {
    payload = {
      name: faker.company.name(),
      address: {
        street: '100 feet road, Shobhagpura',
        city: 'Udaipur',
        state: 'Rajasthan',
        pinCode: 458001,
      },
    };
    const resp = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);

    restaurantId = resp.body.data.id;
  });
  it('should soft delete restaurant by id', async () => {
    const res = await request(app)
      .delete(`/api/restaurants/${restaurantId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .delete(`/api/restaurants/:${restaurantId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).put(`/api/restaurants/${restaurantId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.Restaurant.destroy({
      where: {
        id: restaurantId,
      },
      force: true,
    });
    const res = await request(app)
      .delete(`/api/restaurants/${restaurantId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('restaurant not exists');
    expect(res.statusCode).toEqual(404);
  });
});

afterAll(async () => {
  await sequelize.models.Restaurant.destroy({
    where: {
      name: [payload.name],
    },
    force: true,
  });
  await sequelize.close();
});
