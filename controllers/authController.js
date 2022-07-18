const User = require('../model/User');
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  }

  // const foundUser = usersDB?.users?.find((person) => person.username === user);
  const foundUser = await User.findOne({username : user}).exec();
  console.log('foundUser authController', foundUser);

  if (!foundUser) {
    return res.sendStatus(401); //unauthorized;
  }

  //  eval password => decrpypt;
  const match = await bcrpyt.compare(password, foundUser.password);

  if (match) {
    // todo create JWTs;
    // generate access token
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // generate refresh token
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Saving refreshToken with current user in the DB.
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log('result save the refresh token in db', result);


    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      /*secure: true,*/ //remove when testing with browser / keep it when testing with ThunderClient
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401); // unauthorized;
  }
};

module.exports = {
  handleLogin,
};
