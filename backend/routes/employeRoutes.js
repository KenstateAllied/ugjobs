const express=require('express');
const router=express.Router();
const {addEmployee,updateEmployee,getAllEmployee, deleteEmployee, getEmployeeById} = require('../controllers/employeeController');
const {protect}=require('../middlewares/authMiddleware')
const upload = require('../middlewares/uploadMiddleware');

router.post("/addEmployee", protect, upload.single("image"), addEmployee);
router.put("/updateEmployee/:id", protect, upload.single("image"), updateEmployee);
router.get("/getAllEmployee", protect, getAllEmployee);
router.delete("/deleteEmployee/:id", protect, deleteEmployee);
router.get("/getEmployeeById/:id", protect, getEmployeeById);

module.exports=router;

