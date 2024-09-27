const models = require('../models');

const getAllFoodCategories = async (payload) => {
  const { page, limit } = payload;

  const offset = (page - 1) * limit;

  const foodCategories = await models.FoodCategory.findAndCountAll({
    offset: offset,
    limit: limit,
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (!foodCategories.rows.length) {
    const error = Error('no content available');
    error.statusCode = 204;
    throw error;
  }
  return foodCategories;
};

const createFoodCategory = async (payload) => {
  const { name } = payload;

  const foodCategoryExists = await models.FoodCategory.findOne({
    where: { name },
  });
  if (foodCategoryExists) {
    const error = Error('food category already exists');
    error.statusCode = 409;
    throw error;
  }
  const isSoftDeleted = await models.FoodCategory.findOne({
    where: { name },
    paranoid: false,
  });

  let foodCategory;
  if (isSoftDeleted) {
    await models.FoodCategory.restore({
      where: { name },
    });
    foodCategory = await models.FoodCategory.findOne({
      where: { name },
      attributes: {
        exclude: ['created_at', 'updated_at', 'deleted_at'],
      },
    });
  } else {
    foodCategory = await models.FoodCategory.create(payload);
  }
  return foodCategory;
};

const getFoodCategoryById = async (payload) => {
  const { id } = payload;

  const foodCategoryExists = await models.FoodCategory.findByPk(id, {
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (!foodCategoryExists) {
    const error = Error('food category not exists');
    error.statusCode = 404;
    throw error;
  } else {
    return foodCategoryExists;
  }
};

const updateFoodCategory = async (payload) => {
  const { id } = payload;

  const foodCategoryExists = await models.FoodCategory.findByPk(id, {});
  if (!foodCategoryExists) {
    const error = Error('food category not exists');
    error.statusCode = 404;
    throw error;
  } else {
    await models.FoodCategory.update(payload, { where: { id } });
    return 'food category updated successfully';
  }
};

const deleteFoodCategory = async (payload) => {
  const { permanentDelete, id } = payload;
  let message = 'food category deleted successfully';

  const foodCategoryExists = await models.FoodCategory.findByPk(id);
  if (!foodCategoryExists) {
    const error = Error('food category not exists');
    error.statusCode = 404;
    throw error;
  } else {
    if (permanentDelete) {
      await models.FoodCategory.destroy({ where: { id }, force: true });
      message = 'food category deleted permanently';
    } else {
      await models.FoodCategory.destroy({ where: { id } });
    }
    return message;
  }
};

module.exports = {
  getAllFoodCategories,
  createFoodCategory,
  getFoodCategoryById,
  updateFoodCategory,
  deleteFoodCategory,
};
