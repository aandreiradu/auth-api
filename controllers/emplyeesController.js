const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const allEmployees = await Employee.find().exec();
  if (!allEmployees) {
    return res.status(204).json({ message: "No employees found!" });
  }
  return res.json(allEmployees);
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID is required!" });
  }

  const existingEmployee = await Employee.findOne({ _id: id }).exec();
  if (!existingEmployee) {
    return res
      .status(400)
      .json({ message: `No employee found for this ID ${id}` });
  }

  return res.json(existingEmployee);
};

const createNewEmployee = async (req, res) => {
  const { firstname, lastname } = req.body;

  if (!firstname || !lastname) {
    return res
      .status(400)
      .json({ message: "First and Last names are required!" });
  }

  try {
    const result = await Employee.create({
      firstname,
      lastname,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateEmployee = async (req, res) => {
  const { id, firstname, lastname } = req.body || {};
  if (!id) {
    return res.status(400).json({ message: "ID is required!" });
  }

  const employee = await Employee.findOne({ _id: id }).exec();
  if (!employee) {
    return res.status(204).json({ message: `No Employee matches ID ${id}` });
  }

  if (firstname) {
    employee.firstname = firstname;
  }

  if (lastname) {
    employee.lastname = lastname;
  }

  const result = await employee.save();
  return res.json(result);
};

const deleteEmployee = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required!" });
  }

  const existingEmployee = await Employee.findOne({ _id: id });

  if (!existingEmployee) {
    return res.status(204).json({ message: `No user found with ID : ${id}` });
  }

  const result = await existingEmployee.deleteOne({ _id: id });

  return res.json(result);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
