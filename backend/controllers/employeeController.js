const Employee = require('../models/Employee');
const fs = require('fs');
const path = require('path');



// Get all employees
exports.getEmployees =  async (req, res) => {

  const { page = 1, search = '', sortField = 'createdAt', sortOrder = 'desc' } = req.query;
  const limit = 6;
  const skip = (page - 1) * limit;

  const query = {
    $or: [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ],
  };

  const employees = await Employee.find(query)
    .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const totalEmployees = await Employee.countDocuments(query);
  const totalPages = Math.ceil(totalEmployees / limit);
  

  res.json({ employees, totalPages ,totalEmployees});



};

// Create employee
exports.createEmployee =  async (req, res) => {
  
  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    const image = req.file ? req.file.path : '';

// Validate fields
if (!/^[a-zA-Z\s]+$/.test(name)) {
  return res.status(400).json({ message: 'Name should contain only characters' });
}

else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return res.status(400).json({ message: 'Invalid email format' });
}

else if (!/^\d{10}$/.test(mobile)) {
  return res.status(400).json({ message: 'Mobile should be a 10-digit number' });
}
else if(!['hr', 'manager', 'sales'].includes(designation.toLowerCase())) {
  return res.status(400).json({ message: 'Invalid designation' });
}

else if(!['male', 'female'].includes(gender.toLowerCase())) {
  return res.status(400).json({ message: 'Invalid gender' });
}


else if (!course || course.length < 1) {
  return res.status(400).json({ message: 'Course should be at least 1 characters long' });
}

 // Check if email is unique
 const existingEmployee = await Employee.findOne({ email });
 if (existingEmployee) {
   return res.status(400).json({ message: 'Email already exists' });
 }

    const newEmployee = new Employee({ name, email, mobile, designation, gender, course, image });
   
    const savedEmployee = await newEmployee.save();
    res.status(201).json({savedEmployee, message:'Employee is created'});
  } catch (err) {
    res.status(500).json({message:'Employee is not created'});
  }
};



// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json(err);
  }
};




// Update employee
exports.updateEmployee =  async (req, res) => {
  const { name, email, mobile, designation, gender, course } = req.body;
  const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

// Validate fields
if (!/^[a-zA-Z\s]+$/.test(name)) {
  return res.status(400).json({ message: 'Name should contain only characters' });
}

else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return res.status(400).json({ message: 'Invalid email format' });
}

else if (!/^\d{10}$/.test(mobile)) {
  return res.status(400).json({ message: 'Mobile should be a 10-digit number' });
}

else if(!['hr', 'manager', 'sales'].includes(designation.toLowerCase())) {
  return res.status(400).json({ message: 'Invalid designation' });
}

else if(!['male', 'female'].includes(gender.toLowerCase())) {
  return res.status(400).json({ message: 'Invalid gender' });
}

else if (!course || course.length < 1) {
  return res.status(400).json({ message: 'Course should be at least 1 characters long' });
}




// Check if email is unique (excluding the current employee)
const existingEmployee = await Employee.findOne({ email });
if (existingEmployee && existingEmployee._id.toString() !== req.params.id) {
  return res.status(400).json({ message: 'Email already exists' });
}
 
  try {
    const updatedData = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      designation: req.body.designation,
      gender: req.body.gender,
      course: req.body.course,
      // image: req.file ? req.file.path : req.body.image, // keep the existing image if none uploaded
    };
 
    if (req.file) {
      if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Only jpg and png files are allowed' });
      }
      if (employee.image) {
        const oldImagePath = path.join(__dirname, '../', employee.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }
      updatedData.image = req.file.path;
    } else {
      updatedData.image = employee.image;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updatedData, { new: true });
   
    res.status(200).json({updatedEmployee,message:'Employee updated successfully'});
  } catch (err) {
    res.status(500).json({message:'Employee not updated successfully'});
  }
};



// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    
    if (employee.image) {
      const imagePath = path.join(__dirname, '../', employee.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); 
      }
    }


    await Employee.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
};
