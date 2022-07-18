const User = require('../model/User');
const jwt = require("jsonwebtoken");
// const usersDB = {
//   users: require("../model/users.json"),
//   setUser: function (data) {
//     this.users = data;
//   },
// };

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  // const foundUser = usersDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );
  
  // search the user user by refreshToken
  const foundUser = await User.findOne({refreshToken : refreshToken}).exec();
  console.log('found user REFRESHTOKEN CONTROLLER',foundUser);

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
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
};

module.exports = {
  handleRefreshToken,
};
