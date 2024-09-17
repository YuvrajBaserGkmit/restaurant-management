const models = require('../models');

const getAllAddresses = async (payload) => {
  const { page, limit } = payload;

  const offset = (page - 1) * limit;

  const addresses = await models.Address.findAndCountAll({
    offset: offset,
    limit: limit,
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (!addresses.rows.length) {
    const error = new Error('No content available');
    error.statusCode = 204;
    throw error;
  }
  return addresses;
};

const createAddress = async (payload) => {
  const { id, street, city, state, pinCode, isDefault } = payload;

  const addressPayload = {
    street: street,
    city: city,
    state: state,
    pin_code: pinCode,
  };

  let address = await models.Address.findOne({ where: addressPayload });

  if (address) {
    const error = new Error('Address already exists');
    error.statusCode = 409;
    throw error;
  } else {
    address = await models.Address.create(addressPayload);
  }
  const user = await models.User.findByPk(id);

  if (isDefault) {
    const currentDefaultAddress = await models.UserAddress.findOne({
      where: { is_default: true, user_id: id },
    });
    if (currentDefaultAddress) {
      let userAddress = await models.UserAddress.findOne({
        where: {
          user_id: id,
          address_id: currentDefaultAddress.address_id,
        },
      });
      userAddress.is_default = false;
      await userAddress.save();
    }
  }

  await user.addAddress(address, { through: { is_default: isDefault } });

  return address;
};

const getAddressById = async (payload) => {
  const { id } = payload;

  const address = await models.Address.findByPk(id, {
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });

  if (!address) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  } else {
    return address;
  }
};

const updateAddress = async (payload) => {
  const { id, street, city, state, pinCode } = payload;

  const addressExists = await models.Address.findByPk(id);
  if (!addressExists) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  const addressUpdatePayload = {
    street: street,
    city: city,
    state: state,
    pin_code: pinCode,
  };

  await models.Address.update(addressUpdatePayload, { where: { id } });
  return 'Address updated successfully';
};

const deleteAddress = async (payload) => {
  const { permanentDelete, id } = payload;
  let message = 'Address deleted successfully';

  const addressExists = await models.Address.findByPk(id);
  if (!addressExists) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  } else {
    await models.Address.destroy({ where: { id } });
  }
  return message;
};

module.exports = {
  getAllAddresses,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
};
