const serializeAddress = (req, res, next) => {
  let { rows } = res.data;
  let response = [];
  if (!rows) {
    rows = [res.data];
  }
  for (const address of rows) {
    response.push({
      id: address.id,
      street: address.street,
      city: address.city,
      state: address.state,
      pinCode: address.pin_code,
    });
  }
  if (!res.data.rows) {
    res.data = response[0];
  } else {
    res.data.rows = response;
  }
  next();
};

module.exports = {
  serializeAddress,
};
