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

  if (!id) {
    return res.status(400).json({ message: "ID is required!" });
  }

  const result = await User.deleteOne({ _id: id }).exec();

  return res.json(result);
};

const getUserById = async (req, res) => {
  const { id } = req.params;

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
  const { roleName, id } = req.body;

  if (!roleName || !id) {
    return res.status(400).json({ message: "Role Name and ID are required!" });
  }

  const requestedRoles = Array.isArray(roleName) ? roleName : [roleName];

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

  if (uniqueRoles.length === 0) {
    return res.status(400).json({ message: "Role name/s not found!" });
  }
  const updatedUser = await User.findOne({ _id: id }).exec();
  if (!updatedUser) {
    return res.status(204).json({ message: `No user found for this ID ${id}` });
  }

  const updatedUserJSObj = updatedUser.toObject();

  uniqueRoles?.forEach((role) => {
    return (updatedUserJSObj.roles = {
      ...updatedUserJSObj.roles,
      ...role,
    });
  });
  updatedUser.roles = updatedUserJSObj.roles;

  await updatedUser.save();

  return res
    .status(200)
    .json({
      message: `User with ID ${id} was updated successfully`,
      updatedUser,
    });
};

const removeUserRole = async (req, res) => {
  const { id, role } = req.body;

  if (!id || !role) {
    return res.status(400).json({ message: "ID and Role are required!" });
  }

  // find user based on id;
  const userFind = await User.findOne({ _id: id }).exec();

  if (!userFind) {
    return res
      .status(204)
      .json({ message: `There is not user with this ID: ${id}` });
  }

  // transform received roles : capitalize first letter;
  const rolesReceived = Array.isArray(role) ? role : [role];
  const loweredRoles = rolesReceived.map((role) => role.toLowerCase());
  const rolesArray = loweredRoles.map(
    (role) => role.charAt(0).toUpperCase() + role.slice(1)
  );

  const uniqueCodes = [];
  const uniqueRoles = rolesArray.filter((element) => {
    const isDuplicate = uniqueCodes.includes(Object.values(element)[0]);
    if (!isDuplicate) {
      uniqueCodes.push(Object.values(element)[0]);
      return true;
    }
    return false;
  });

  const assignedUserRoles = uniqueRoles.filter((role) => {
    role = role.toLowerCase();
    role = role.charAt(0).toUpperCase() + role.slice(1);
    if (userFind.roles[role]) {
      return role;
    }
  });

  if (assignedUserRoles?.length === 0) {
    return res.json({ message: `No roles found assigned to this user ${id}` });
  } else {
    const userFindJSObject = userFind.toObject();
    assignedUserRoles.forEach(
      (assigned) => delete userFindJSObject.roles[assigned]
    );

    userFind.roles = userFindJSObject.roles;
    const saveResponse = await userFind.save();
    return res.json(saveResponse);
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUserById,
  addUserRoles,
  removeUserRole,
};
