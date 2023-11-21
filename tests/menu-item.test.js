const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { sequelize } = require('../models');

const app = require('../app');

let payload = {
  title: 'Spaghetti Bolognese',
  description: 'Classic Italian pasta with meat sauce',
  price: 12.99,
  category: 'Pasta',
};

let adminAccessToken;

beforeAll(async () => {
  const admin = await sequelize.models.User.findOne({
    where: {
      email: 'admin@gmail.com',
    },
  });

  if (admin) {
    // Login and save the admin accessToken
    const resp = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@gmail.com', password: 'Admin@1234' });
    adminAccessToken =
      resp.statusCode === 200 ? resp.body.data.accessToken : null;
  }
});

describe('TEST GET api/menu-items API', () => {
  it('should get all menu items', async () => {
    const res = await request(app)
      .get('/api/menu-items')
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should give correct response if there is no data', async () => {
    const res = await request(app)
      .get('/api/menu-items')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ page: 10, limit: 10 });
    expect(res.statusCode).toEqual(204);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get('/api/menu-items')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ pages: 1, limit: 10 }); // pages is invalid
    expect(res.body.message).toEqual('pages is not allowed');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app)
      .get('/api/menu-items')
      .query({ page: 1, limit: 10 });
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });
});

describe('TEST POST api/menu-items API', () => {
  it('should create a menu item', async () => {
    const res = await request(app)
      .post('/api/menu-items')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toBe(201);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .post('/api/menu-items')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        titles: 'Spaghetti Bolognese',
        description: 'Classic Italian pasta with meat sauce',
        price: 12.99,
      });
    expect(res.body.message).toEqual('Title is required');
    expect(res.statusCode).toBe(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).post('/api/menu-items').send(payload);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toBe(401);
  });
});

describe('TEST GET api/menu-items/:itemId API', () => {
  let itemId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/menu-items')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    itemId = res.body.data.id;
  });

  it('should get menu item by id', async () => {
    const res = await request(app)
      .get(`/api/menu-items/${itemId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .get(`/api/menu-items/:${itemId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).get(`/api/menu-items/${itemId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.MenuItem.destroy({
      where: {
        id: itemId,
      },
      force: true,
    });
    const res = await request(app)
      .get(`/api/menu-items/${itemId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('menu item not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST PUT api/menu-items/:itemId API', () => {
  let itemId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/menu-items')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    itemId = res.body.data.id;
  });

  it('should update menu item by id', async () => {
    payload.title = 'Spaghetti Aglio e Olio';
    payload.description = 'Italian pasta with garlic and olive oil';
    payload.price = 14.99;

    const res = await request(app)
      .put(`/api/menu-items/${itemId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .put(`/api/menu-items/:${itemId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).put(`/api/menu-items/${itemId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.MenuItem.destroy({
      where: {
        id: itemId,
      },
      force: true,
    });
    const res = await request(app)
      .put(`/api/menu-items/${itemId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    expect(res.body.message).toEqual('menu item not exists');
    expect(res.statusCode).toEqual(404);
  });
});

describe('TEST DELETE api/menu-items/:itemId API', () => {
  let itemId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/menu-items')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(payload);
    itemId = res.body.data.id;
  });

  it('should soft delete menu item by id', async () => {
    const res = await request(app)
      .delete(`/api/menu-items/${itemId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should hard delete menu item by id', async () => {
    const res = await request(app)
      .delete(`/api/menu-items/${itemId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .query({ permanentDelete: true });
    expect(res.body.message).toEqual('Success');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow invalid request', async () => {
    const res = await request(app)
      .delete(`/api/menu-items/:${itemId}`) // : fails the uuid validation
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('id must be a valid GUID');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow access to unauthorized user', async () => {
    const res = await request(app).delete(`/api/menu-items/${itemId}`);
    expect(res.body.message).toEqual('Access denied');
    expect(res.statusCode).toEqual(401);
  });

  it('should check if the request resource is present or not', async () => {
    await sequelize.models.MenuItem.destroy({
      where: {
        id: itemId,
      },
      force: true,
    });
    const res = await request(app)
      .delete(`/api/menu-items/${itemId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.body.message).toEqual('menu item not exists');
    expect(res.statusCode).toEqual(404);
  });
});

afterAll(async () => {
  await sequelize.close();
});
