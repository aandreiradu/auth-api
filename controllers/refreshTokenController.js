const jwt = require("jsonwebtoken");
require("dotenv").config();
const usersDB = {
  users: require("../model/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); //Forbidden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }

    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          roles: roles,
          username: decoded.username,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    res.json({ accessToken });
  });
};

module.exports = {
  handleRefreshToken,
};
