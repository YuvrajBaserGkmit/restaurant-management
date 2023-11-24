const { where } = require('sequelize');
const models = require('../models');

const getAllRestaurants = async (payload) => {
  const { id, page, limit, name, city, state } = payload;

  const offset = (page - 1) * limit;

  const nameFilter = name ? { name } : {};
  let addressFilter;

  if (city && state) {
    addressFilter = {
      city: city,
      state: state,
    };
  } else if (city) {
    addressFilter = {
      city: city,
    };
  } else if (state) {
    addressFilter = {
      state: state,
    };
  } else {
    addressFilter = {};
  }

  const restaurants = await models.Restaurant.findAndCountAll({
    offset: offset,
    limit: limit,
    where: nameFilter,
    include: {
      model: models.Address,
      where: addressFilter,
      attributes: {
        exclude: ['created_at', 'updated_at', 'deleted_at'],
      },
    },
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at', 'address_id'],
    },
  });

  if (!restaurants.rows.length) {
    const error = Error('no content available');
    error.statusCode = 204;
    throw error;
  }

  return restaurants;
};

const createRestaurant = async (payload) => {
  const { name, id, address } = payload;

  const restaurantExists = await models.Restaurant.findOne({ where: { name } });
  if (restaurantExists) {
    const error = Error('Restaurant already exists');
    error.statusCode = 409;
    throw error;
  }

  address.pin_code = address.pinCode;
  const createdAddress = await models.Address.create(address);

  const isSoftDeleted = await models.Restaurant.findOne({
    where: { name },
    paranoid: false,
  });

  let restaurant;
  if (isSoftDeleted) {
    await models.Restaurant.restore({ where: { name: name } });
    restaurant = await models.Restaurant.findOne({ where: { name } });
  } else {
    const restaurantPayload = {
      name: name,
      owner_id: id,
      address_id: createdAddress.id,
    };
    restaurant = await models.Restaurant.create(restaurantPayload);
  }
  const restaurantDetails = {
    id: restaurant.id,
    restaurantName: restaurant.name,
    restaurantAddress: {
      id: createdAddress.id,
      street: createdAddress.street,
      city: createdAddress.city,
      state: createdAddress.state,
      pinCode: createdAddress.pin_code,
    },
    restaurantOwner: {
      id: id,
    },
  };
  return restaurantDetails;
};

const getRestaurantById = async (payload) => {
  const { id } = payload;

  const restaurantExists = await models.Restaurant.findByPk(id, {
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (!restaurantExists) {
    const error = Error('restaurant not exists');
    error.statusCode = 404;
    throw error;
  } else {
    const owner = await models.User.findByPk(restaurantExists.owner_id, {
      attributes: {
        exclude: ['created_at', 'updated_at', 'deleted_at'],
      },
    });
    const address = await models.Address.findByPk(restaurantExists.address_id, {
      attributes: {
        exclude: ['created_at', 'updated_at', 'deleted_at'],
      },
    });

    const restaurantDetails = {
      id: restaurantExists.id,
      restaurantName: restaurantExists.name,
      restaurantAddress: {
        id: address.id,
        street: address.street,
        city: address.city,
        state: address.state,
        pinCode: address.pin_code,
      },
      restaurantOwner: {
        id: owner.id,
        name: owner.first_name + ' ' + owner.last_name,
        email: owner.email,
        phoneNumber: owner.phone_number,
      },
    };

    return restaurantDetails;
  }
};

const updateRestaurant = async (payload) => {
  const { name, id, address } = payload;

  const restaurantExists = await models.Restaurant.findOne({ where: { name } });
  if (!restaurantExists) {
    const error = Error('Restaurant not exists');
    error.statusCode = 404;
    throw error;
  }

  address.pin_code = address.pinCode;
  const updatedAddress = await models.Address.update(address, {
    where: { id: restaurantExists.address_id },
  });

  const restaurantPayload = {
    name: name,
    owner_id: restaurantExists.owner_id,
    address_id: restaurantExists.address_id,
  };
  restaurant = await models.Restaurant.update(restaurantPayload, {
    where: { id },
  });

  return 'restaurant updated successfully';
};

const deleteRestaurant = async (payload) => {
  const { permanentDelete, id } = payload;
  let message = 'restaurant deleted successfully';

  const restaurantExists = await models.Restaurant.findByPk(id);
  if (!restaurantExists) {
    const error = Error('restaurant not exists');
    error.statusCode = 404;
    throw error;
  } else {
    if (permanentDelete) {
      await models.Restaurant.destroy({
        where: {
          id: id,
        },
        force: true,
      });
      message = 'restaurant deleted permanently';
    } else {
      await models.Restaurant.destroy({
        where: {
          id: id,
        },
      });
    }
    return message;
  }
};

module.exports = {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
