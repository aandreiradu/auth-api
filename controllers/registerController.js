const User = require('../model/User');
const bcrpyt = require("bcrypt");
// const fsPromises = require("fs").promises;
// const path = require("path");

// const usersDB = {
//   users: require("../model/users.json"),
//   setUser: function (data) {
//     this.users = data;
//   },
// };

const handleNewUser = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  }

  //   check for duplicate to duplicates username;
  // const duplicate = usersDB.users?.find((person) => person.username === user);
  const duplicate = await User.findOne({username : user}).exec();
  if (duplicate) {
    return res.sendStatus(409);
  }

  try {
    // start creating the user;
    const hashedPwd = await bcrpyt.hash(password, 10);

    // store the new user;
    const result = await User.create({
      username: user,
      // default roles is already set in the User model
      // roles: {
        // User: 2022,
      // },
      password: hashedPwd,
    });

    console.log('RESULT INSERT',result);


    // insert the user
    // usersDB.setUser([...usersDB.users, newUser]);
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(usersDB.users)
    // );

    // create and store the new user;
    

    return res.status(201).json({ message: `New user ${user} created` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export
module.exports = {
  handleNewUser,
};
