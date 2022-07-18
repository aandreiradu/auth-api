const User = require('../model/User');
// const fsPromises = require("fs").promises;
// const path = require("path");
// const usersDB = {
//   users: require("../model/users.json"),
//   setUser: function (data) {
//     this.users = data;
//   },
// };

const handleLogOut = async (req, res) => {
  //   on client also delete the access token;
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204); // no content
  }
  const refreshToken = cookies.jwt;

  //   check refreshToken in db
  const foundUser = await User.findOne({refreshToken : refreshToken}).exec();
  console.log('found user Logout controller', foundUser);

  if (!foundUser) {
    // clear cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(204);
  }

  // delete the refreshToken in db and save
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log('result delete token from db', result);

  
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.sendStatus(204);
};

module.exports = {
  handleLogOut,
};
