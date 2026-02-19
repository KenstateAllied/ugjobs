const Employee = require('../modals/Employee');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');

exports.addEmployee = async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, course } = req.body;
        const image = req.file?.path || "";

        // Check required fields
        if (!name || !email || !mobile || !designation || !gender || !course || !image) {
            return res.status(400).json({
                message: "All fields (name, email, mobile, designation, gender, course, image) are required"
            });
        }

        // Name validation
        if (name.trim().length < 3) {
            return res.status(400).json({
                message: "Name must be at least 3 characters long"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Mobile validation (10-digit numeric)
        if (!/^\d{10}$/.test(mobile)) {
            return res.status(400).json({
                message: "Mobile number must be 10 digits"
            });
        }

        // designation validation
        if (designation.trim().length < 2) {
            return res.status(400).json({
                message: "Designation must be at least 2 characters long"
            });
        }

        // Gender validation
        const allowedGenders = ["Male", "Female", "Other"];
        if (!allowedGenders.includes(gender)) {
            return res.status(400).json({
                message: `Gender must be one of: ${allowedGenders.join(", ")}`
            });
        }

        // Course validation
        const allowedCourses = ["MCA", "BCA", "BSC"];
        if (!allowedCourses.includes(course)) {
            return res.status(400).json({
                message: `Course must be one of: ${allowedCourses.join(", ")}`
            });
        }

        // Check duplicates
        if (await Employee.findOne({ email })) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        if (await Employee.findOne({ mobile })) {
            return res.status(400).json({
                message: "Mobile number already exists"
            });
        }

        await Employee.create({
            id: nanoid(8),
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image: image || "",
            user: req.user._id
        })

        res.status(201).json({
            message: "Employee Added successfully",
            success: true
        })

    } catch (error) {
        res.status(400).json({
            message: "Failed to add New Employee",
            error: error.message,
            success: false
        })
    }
};


exports.updateEmployee = async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, course } = req.body;
        const empId = req.params.id || req.query.id;

        // Check if empId is provided
        if (!empId) {
            return res.status(400).json({
                message: "Employee ID is required"
            });
        }

        // Check if employee exists
        const employee = await Employee.findById(empId);
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        // Validate each field if provided (optional updates allowed)
        const image = req.file?.path || employee.image;

        if (name && name.trim().length < 3) {
            return res.status(400).json({
                message: "Name must be at least 3 characters long"
            });
        }

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "Invalid email format"
                });
            }
            const existingEmail = await Employee.findOne({ email, _id: { $ne: empId } });
            if (existingEmail) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }
        }

        if (mobile) {
            if (!/^\d{10}$/.test(mobile)) {
                return res.status(400).json({
                    message: "Mobile number must be 10 digits"
                });
            }
            const existingMobile = await Employee.findOne({ mobile, _id: { $ne: empId } });
            if (existingMobile) {
                return res.status(400).json({
                    message: "Mobile number already exists"
                });
            }
        }

        if (designation && designation.trim().length < 2) {
            return res.status(400).json({
                message: "Designation must be at least 2 characters long"
            });
        }

        if (gender) {
            const allowedGenders = ["Male", "Female"];
            if (!allowedGenders.includes(gender)) {
                return res.status(400).json({
                    message: "Gender not allowed"
                });
            }
        }

        if (course) {
            const allowedCourses = ["MCA", "BCA", "BSC"];
            if (!allowedCourses.includes(course)) {
                return res.status(400).json({
                    message: "Course not listed"
                });
            }
        }

        // Delete old image if a new image is provided
        if (req.file && employee.image) {
            const imagePath = path.join(__dirname, '../', employee.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Employee.findByIdAndUpdate(empId, { name, email, mobile, designation, gender, course, image });

        res.status(200).json({
            message: "Employee data updated successfully",
            success: true
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to update employee data",
            error: error.message,
            success: false
        });
    }
};

exports.getAllEmployee = async (req, res) => {
    try {
        const employees = await Employee.find();

        res.status(200).json({
            message: "Employee fetched successfully",
            employees: employees
        })

    } catch (error) {
        res.status(400).json({
            message: "failed to fetch employee",
            error: error.message
        })
    }
}

exports.getEmployeeById = async (req,res) => {
    try {
        const empId=req.params.id || req.query.id;

        if(!empId){
            res.status(400).json({
                message: "employe Id is required",
                success: false
            })
        }

        const employee=await Employee.findById(empId);

        res.status(200).json({
            message: "Employee details fetched successfully",
            employee,
            success: true
        })
        
    } catch (error) {
        res.status(400).json({
            message: "Failed to find employee",
            error: error.message,
            success: false
        })
        
    } 
}


exports.deleteEmployee = async (req, res) => {
    try {
        const empId = req.params.id || req.query.id;

        const employee = await Employee.findById(empId);
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        if (employee.image) {
            const imagePath = path.join(__dirname, '../', employee.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Employee.findByIdAndDelete(empId);

        res.status(200).json({
            message: "Employee deleted successfully",
            success: true
        });

    } catch (error) {
        res.status(400).json({
            message: "Employee deletion failed",
            error: error.message,
            success: false
        });
    }
};