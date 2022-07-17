// accept as many roles as we wanted
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) res.sendStatus(401);

    const rolesArray = [...allowedRoles];

    const result = req.roles
      ?.map((role) => rolesArray.includes(role))
      .find((value) => Boolean(value));

    if (!result) return res.sendStatus(401);

    // let the route to be accessed
    next();
  };
};

module.exports = verifyRoles;
