const path = require("path");
const data = {
  employees: require(path.join(__dirname, "..", "/model", "employees.json")),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID is required!" });
  }

  const existingEmployee = data?.employees?.find((emp) => emp.id === +id);
  if (!existingEmployee) {
    return res.status(400).json({ message: `No employee found for this ID ${id}` });
  }

  return res.json(existingEmployee);
};

const createNewEmployee = (req, res) => {
  const { firstname, lastname } = req.body;
  const newEmployee = {
    id: data.employees?.length
      ? data.employees[data.employees.length - 1].id + 1
      : 1,
    firstname,
    lastname,
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({
      message: "First and Last names are required!",
    });
  }

  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  const { id, firstname, lastname } = req.body || {};
  if (!id) {
      return res.status(400).json({ message: "ID is required!" });

  }

  const existingEmployeeIndex = data?.employees?.findIndex(
    (emp) => emp.id === +id
  );
  const existingEmployeeItem = data.employees[existingEmployeeIndex];

  if (!existingEmployeeItem) {
    return res.status(400).json({ message: `Employee with id ${id} not found` });
  }

  if (firstname) {
    existingEmployeeItem.firstname = firstname;
  }

  if (lastname) {
    existingEmployeeItem.lastname = lastname;
  }

  let updatedItems = [...data.employees];
  updatedItems[existingEmployeeIndex] = existingEmployeeItem;
  data.setEmployees([...updatedItems]);

  return res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required!" });
    
  }

  const existingEmployeeIndex = data?.employees.findIndex(
    (emp) => emp.id === parseInt(id)
  );
  
  const existingEmployee = data.employees[existingEmployeeIndex];

  if (!existingEmployee) {
    return res.status(400).json({ message: `No user found with this ID : ${id}` });
    
  }

  const updatedEmployees = data?.employees.filter(
    (emp) => emp.id !== existingEmployee.id
  );
  data.setEmployees([...updatedEmployees]);
  return res.json(data.employees);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
