const serializeUsers = (req, res, next) => {
  const data = res.data || null;
  let response = [];
  for (const user of data) {
    response.push({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number,
      roleId: user.role_id,
      role: data.role,
    });
  }
  res.data = response;
  next();
};

const serializeUser = (req, res, next) => {
  const data = res.data || null;
  const response = {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phoneNumber: data.phone_number,
    roleId: data.role_id,
    role: data.role,
  };
  res.data = response;
  next();
};

module.exports = {
  serializeUsers,
  serializeUser,
};
