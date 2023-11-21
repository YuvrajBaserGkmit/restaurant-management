const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { sequelize } = require('../models');

const app = require('../app');

let payload = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  phoneNumber: faker.number
    .int({ min: 1000000000, max: 9999999999 })
    .toString(),
  password: faker.internet.password(),
  role: 'customer',
};

let foodCategoryPayload = {
  name: 'Appetizers',
  description: 'Delicious appetizers to start your meal',
};

const adminEmail = 'admin@gmail.com';
const adminPassword = 'Admin@1234';
let adminAccessToken;
let customerAccessToken;
let foodCategoryId;

beforeAll(async () => {
  const admin = await sequelize.models.User.findOne({
    where: {
      email: 'admin@gmail.com',
    },
  });
  const customer = await request(app).post('/api/users').send(payload);

  if (admin) {
    // Login and save the admin accessToken
    const resp = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: adminPassword });
    adminAccessToken =
      resp.statusCode === 200 ? resp.body.data.accessToken : null;
  }
  if (customer.body.statusCode === 201) {
    // Login and save the customer accessToken
    const resp = await request(app)
      .post('/api/auth/login')
      .send({ email: payload.email, password: payload.password });
    customerAccessToken =
      resp.statusCode === 200 ? resp.body.data.accessToken : null;
  }
});

describe('TEST GET api/food-categories API', () => {
  it('should get all food categories', async () => {
    const res = await request(app)
      .get('/api/food-categories')
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should give correct response if there is no data', async () => {
    const res = await request(app)
      .get('/api/food-categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ page: 10, limit: 10 });
    expect(res.statusCode).toEqual(204);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get('/api/food-categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ pages: 1, limit: 10 }); // pages is invalid
    expect(res.body.message).toEqual('pages is not allowed');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app)
      .get('/api/food-categories')
      .query({ page: 1, limit: 10 });
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user don't have required permission`, async () => {
    const res = await request(app)
      .get('/api/food-categories')
      .set('Authorization', `Bearer ${customerAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });
});

describe('TEST POST api/food-categories API', () => {
  it('should create a food category', async () => {
    const res = await request(app)
      .post('/api/food-categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(foodCategoryPayload);

    foodCategoryId = res.body.data.id;
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toBe(201);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .post('/api/food-categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        names: 'Appetizers',
        description: 'Delicious appetizers to start your meal',
      });
    expect(res.body.message).toEqual('Name is required');
    expect(res.statusCode).toBe(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app)
      .post('/api/food-categories')
      .send(foodCategoryPayload);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toBe(401);
  });

  it(`should not allow access if the user don't have required permission`, async () => {
    const res = await request(app)
      .post('/api/food-categories')
      .set('Authorization', `Bearer ${customerAccessToken}`)
      .send(foodCategoryPayload);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toBe(403);
  });
});

describe('TEST GET api/food-categories/:foodCategoryId API', () => {
  it('should get food category by id', async () => {
    const res = await request(app)
      .get(`/api/food-categories/${foodCategoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get(`/api/food-categories/:${foodCategoryId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).get(
      `/api/food-categories/${foodCategoryId}`,
    );
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user don't have required permission`, async () => {
    const res = await request(app)
      .get(`/api/food-categories/${foodCategoryId}`)
      .set('Authorization', `Bearer ${customerAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.FoodCategory.destroy({
      where: {
        id: foodCategoryId,
      },
      force: true,
    });
    const res = await request(app)
      .get(`/api/food-categories/${foodCategoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('food category not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST PUT api/food-categories/:foodCategoryId API', () => {
  it('should update food category by id', async () => {
    const resp = await request(app)
      .post('/api/food-categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(foodCategoryPayload);

    foodCategoryId = resp.body.data.id;

    foodCategoryPayload.name = 'Main Course';
    foodCategoryPayload.description = 'Delicious main course dishes';
    const res = await request(app)
      .put(`/api/food-categories/${foodCategoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(foodCategoryPayload);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .put(`/api/food-categories/:${foodCategoryId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).put(
      `/api/food-categories/${foodCategoryId}`,
    );
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user don't have required permission`, async () => {
    const res = await request(app)
      .put(`/api/food-categories/${foodCategoryId}`)
      .set('Authorization', `Bearer ${customerAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.FoodCategory.destroy({
      where: {
        id: foodCategoryId,
      },
      force: true,
    });
    const res = await request(app)
      .put(`/api/food-categories/${foodCategoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(foodCategoryPayload);
    expect(res.body.message).toEqual('food category not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST DELETE api/food-categories/:foodCategoryId API', () => {
  it('should soft delete food category by id', async () => {
    const resp = await request(app)
      .post('/api/food-categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(foodCategoryPayload);

    foodCategoryId = resp.body.data.id;

    const res = await request(app)
      .delete(`/api/food-categories/${foodCategoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should hard delete food category by id', async () => {
    const resp = await request(app)
      .post('/api/food-categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(foodCategoryPayload);

    foodCategoryId = resp.body.data.id;

    const res = await request(app)
      .delete(`/api/food-categories/${foodCategoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ permanentDelete: true });
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .delete(`/api/food-categories/:${foodCategoryId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).put(
      `/api/food-categories/${foodCategoryId}`,
    );
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it(`should not allow access if the user don't have required permission`, async () => {
    const res = await request(app)
      .put(`/api/food-categories/${foodCategoryId}`)
      .set('Authorization', `Bearer ${customerAccessToken}`);
    expect(res.body.message).toEqual(
      `you don't have required permission to access this api endpoint`,
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.FoodCategory.destroy({
      where: {
        id: foodCategoryId,
      },
      force: true,
    });
    const res = await request(app)
      .delete(`/api/food-categories/${foodCategoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('food category not exists');
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
  await sequelize.models.FoodCategory.destroy({
    where: {
      id: foodCategoryId,
    },
    force: true,
  });
  await sequelize.close();
});
