const User = require("../../model/User");
const express = require("express");
const router = express.Router();
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");
const {
  getAllUsers,
  deleteUser,
  getUserById,
  addUserRoles
} = require("../../controllers/usersController");

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), getAllUsers)
  .post(verifyRoles(ROLES_LIST.Admin),addUserRoles)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);

router.route("/:id").get(verifyRoles(ROLES_LIST.Admin),getUserById);


module.exports = router;