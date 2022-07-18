const User = require("../model/User");

const getAllUsers = async (req, res) => {
  const users = await User.find().exec();

  if (!users) {
    return res.status(204).json({ message: "No users found" });
  }

  return res.status(200).json(users);
};

const deleteUser = async (req, res) => {
  const { id } = req.body;
  console.log("deleteUser id", id);

  if (!id) {
    return res.status(400).json({ message: "ID is required!" });
  }

  const result = await User.deleteOne({ _id: id }).exec();
  console.log("result delete user", result);

  return res.json(result);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  if (!id) {
    return res.status(400).json({ message: `ID is required!` });
  }

  const user = await User.findOne({ _id: id }).exec();
  if (!user) {
    return res.status(204).json({ message: `User ID ${id} not found!` });
  }

  return res.json(user);
};

const addUserRoles = async (req, res) => {
  const ROLES_LIST = require("../config/roles_list");
  const { roleName,id } = req.body;

  console.log("roleName", roleName);

  if (!roleName || !id) {
    return res.status(400).json({ message: "Role Name and ID are required!" });
  }

  const requestedRoles = Array.isArray(roleName) ? roleName : [roleName];
  console.log("requestedRoles", requestedRoles);

  const insertedRoles = requestedRoles
    .map((role) => {
      const requestedRole = role.toLowerCase();
      const roleID =
        ROLES_LIST[
          requestedRole.charAt(0).toUpperCase() + requestedRole.slice(1)
        ];
      const roleName = Object.keys(ROLES_LIST).find(
        (key) => ROLES_LIST[key] === roleID
      );
      return {
        [roleName]: roleID,
      };
    })
    .filter((element) => (Object.values(element) > 0 ? element : ""));

  const uniqueCodes = [];
  const uniqueRoles = insertedRoles.filter((element) => {
    const isDuplicate = uniqueCodes.includes(Object.values(element)[0]);
    if (!isDuplicate) {
      uniqueCodes.push(Object.values(element)[0]);
      return true;
    }
    return false;
  });

  console.log("uniqueRoles", uniqueRoles);
  if (uniqueRoles.length === 0) {
    return res.status(400).json({ message: "Role name/s not found!" });
  }

  const updatedUser = await User.findOne({_id : id}).exec();
  console.log('updatedUser result',updatedUser);

  if(!updatedUser) {
    return res.status(204).json({message: `No user found for this ID ${id}`});
  }


  console.log('start update roles');
  updatedUser.roles = uniqueRoles;
  updatedUser.save();
  console.log('stop update roles');

  return res.status(200).json({message : `User with ID ${id} was updated successfully`});
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUserById,
  addUserRoles,
};
