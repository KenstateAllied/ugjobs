import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from '../api'
import toast from "react-hot-toast";

export default function CreateEmployee({ mode }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        designation: "",
        gender: "",
        course: "",
        image: null,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                if (mode === "edit" && id) {
                    const res = await API.get(`/employee/getEmployeeById/${id}`);
                    setFormData(res?.data?.employee);
                }
            } catch (error) {
                console.error("Failed to fetch employee:", error.response?.data || error);
            }
        };

        fetchEmployee();
    }, [mode, id]);


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => {
                const newCourses = checked
                    ? [...prev.course, value]
                    : prev.course.filter((c) => c !== value);
                return { ...prev, courses: newCourses };
            });
        } else if (type === "file") {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "courses") {
                    formData.course.forEach((course) => data.append("courses", course));
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (mode === "edit") {
              const res=  await API.put(`/employee/updateEmployee/${id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if(res?.data?.success){
                    toast.success("Employee updated successfully!");
                }
                
            } else {
              const res=  await API.post("/employee/addEmployee", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if(res?.data?.success){
                    toast.success("Employee added successfully!");
                }
                
            }

            navigate("/employees");
        } catch (error) {
            toast.error(error.response.data.message);
            setErrors(error.response?.data?.errors || {});
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="bg-yellow-300 px-4 py-2 font-semibold text-lg rounded-t-md">
                {mode === "create" ? "Create Employee" : "Update Employee"}
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-blue-50 p-6 rounded-b-md shadow"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium">Mobile No</label>
                        <input
                            type="number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                        />
                        {errors.mobile && (
                            <p className="text-red-500 text-sm">{errors.mobile}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium">Profession</label>
                        <select
                            name="designation"
                            value={formData.designation || ""}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                        >
                            <option value="">Select</option>
                            <option value="HR">Mechanic-Auto</option>
                            <option value="Manager">Mechanic-Tractor</option>
                            <option value="Sales">Plumber</option>
                            <option value="HR">Mason</option>
                            <option value="Manager">Electrician</option>
                            <option value="Sales">Saloonist</option>
                            <option value="HR">Herbalist</option>
                            <option value="Manager">Nurse</option>
                            <option value="Sales">Driver</option>
                        </select>
                        {errors.designation && (
                            <p className="text-red-500 text-sm">{errors.designation}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium">Ward</label>
                        <div className="flex gap-4">
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === "Male"}
                                    onChange={handleChange}
                                />{" "}
                                Male
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === "Female"}
                                    onChange={handleChange}
                                />{" "}
                                Female
                            </label>
                        </div>
                        {errors.gender && (
                            <p className="text-red-500 text-sm">{errors.gender}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium"></label>
                        <div className="flex gap-4">
                            {["MCA", "BCA", "BSC"].map((course) => (
                                <label key={course}>
                                    <input
                                        type="radio"
                                        name="course"
                                        value={course}
                                        checked={formData.course === course}
                                        onChange={handleChange}
                                    />{" "}
                                    {course}
                                </label>
                            ))}
                        </div>
                        {errors.course && (
                            <p className="text-red-500 text-sm">{errors.course}</p>
                        )}
                    </div>


                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block font-medium">Image Upload</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                name="image"
                                className="border rounded px-3 py-2 w-full"
                            />
                            {errors.image && (
                                <p className="text-red-500 text-sm">{errors.image}</p>
                            )}
                        </div>

                        {/* Preview */}
                        {formData.image && (
                            <div className="w-20 h-20">
                                <img
                                    src={
                                        typeof formData.image === "string"
                                            ? `${process.env.REACT_APP_BASE_URL}/${formData.image.replace("\\", "/")}`
                                            : URL.createObjectURL(formData.image)
                                    }
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>
                        )}
                    </div>

                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded shadow"
                    >
                        {mode === "create" ? "Create" : "Update"}
                    </button>
                </div>
            </form>
        </div>
    )
};
