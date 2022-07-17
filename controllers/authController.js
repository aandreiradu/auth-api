const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");
const usersDB = {
  users: require("../model/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};

const handleLogin = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  }

  const foundUser = usersDB?.users?.find((person) => person.username === user);

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
      { expiresIn: "30s" }
    );

    // generate refresh token
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Saving refreshToken with current user
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUser([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    // res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
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
