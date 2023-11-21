const models = require('../models');

const getAllMenuItems = async (payload) => {
  const { page, limit } = payload;

  const offset = (page - 1) * limit;

  const menuItems = await models.MenuItem.findAll({
    offset: offset,
    limit: limit,
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (!menuItems.length) {
    const error = Error('no content available');
    error.statusCode = 204;
    throw error;
  }
  return menuItems;
};

const createMenuItem = async (payload) => {
  const { name, description, isVeg, price, restaurant, foodCategory } = payload;

  const menuItemExists = await models.MenuItem.findOne({
    where: { name },
  });
  if (menuItemExists) {
    const error = Error('menu item already exists');
    error.statusCode = 409;
    throw error;
  }

  const restaurantExists = await models.Restaurant.findOne({
    where: { name: restaurant.name },
  });
  if (!restaurantExists) {
    const error = Error('restaurant not found');
    error.statusCode = 404;
    throw error;
  }

  const isRestaurantOwner = await models.Restaurant.findOne({
    where: { name: restaurant.name },
  });
  if (!restaurantExists) {
    const error = Error('restaurant not found');
    error.statusCode = 404;
    throw error;
  }

  const foodCategoryExists = await models.FoodCategory.findOne({
    where: { name: foodCategory.name },
  });
  if (!foodCategoryExists) {
    const error = Error('food category not found');
    error.statusCode = 404;
    throw error;
  }

  const isSoftDeleted = await models.MenuItem.findOne({
    where: { name },
    paranoid: false,
  });

  let menuItem;
  if (isSoftDeleted) {
    await models.MenuItem.restore({
      where: { name },
    });
    menuItem = await models.MenuItem.findOne({
      where: { name },
    });
  } else {
    const menuItemPayload = {
      name: name,
      description: description,
      is_veg: isVeg,
      price: price,
      restaurant_id: restaurantExists.id,
      food_category_id: foodCategoryExists.id,
    };
    menuItem = await models.MenuItem.create(menuItemPayload);
  }
  return menuItem;
};

const getMenuItemById = async (payload) => {
  const { id } = payload;

  const menuItemExists = await models.MenuItem.findByPk(id, {
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (!menuItemExists) {
    const error = Error('menu item not exists');
    error.statusCode = 404;
    throw error;
  } else {
    return menuItemExists;
  }
};

const updateMenuItem = async (payload) => {
  const { id } = payload;

  const menuItemExists = await models.MenuItem.findByPk(id, {});
  if (!menuItemExists) {
    const error = Error('menu item not exists');
    error.statusCode = 404;
    throw error;
  } else {
    await models.MenuItem.update(payload, {
      where: { id },
    });
    return 'menu item updated successfully';
  }
};

const deleteMenuItem = async (payload) => {
  const { permanentDelete, id } = payload;
  let message = 'menu item deleted successfully';

  const menuItemExists = await models.MenuItem.findByPk(id);
  if (!menuItemExists) {
    const error = Error('menu item not exists');
    error.statusCode = 404;
    throw error;
  } else {
    if (permanentDelete) {
      await models.MenuItem.destroy({
        where: { id },
        force: true,
      });
      message = 'menu item deleted permanently';
    } else {
      await models.MenuItem.destroy({
        where: { id },
      });
    }
    return message;
  }
};

module.exports = {
  getAllMenuItems,
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
