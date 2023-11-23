const serializeUser = (req, res, next) => {
  let { rows } = res.data;
  let response = [];
  if (!rows) {
    rows = [res.data];
  }
  for (const user of rows) {
    response.push({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number,
      roleId: user.role_id,
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
  serializeUser,
};
