import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from '../api'
import toast from "react-hot-toast";


export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await API.get("/employee/getAllEmployee");
        setEmployees(res.data.employees);
        setFilteredEmployees(res.data.employees);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployee();
  }, []);

  // Search
  useEffect(() => {
    let data = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toString().includes(search)
    );
    setFilteredEmployees(data);
    setCurrentPage(1);
  }, [search, employees]);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedData = [...filteredEmployees].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredEmployees(sortedData);
  };

  // Paging
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/employee/deleteEmployee/${id}`);
      if (res.data.success) {
        const updatedEmployees = employees.filter((emp) => emp._id !== id);
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);
        toast.success("Employee deleted successfully");
      }
    } catch (err) {
      toast.error("failed to delete")
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="bg-yellow-300 px-4 py-2 font-semibold text-lg rounded-t-md">
        Professionals List
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-blue-100 p-3 rounded-b-md">
        <p className="font-medium text-gray-700">
          Total Count: {filteredEmployees.length}
        </p>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Link
            to="/create-employee"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow"
          >
            Create Professional
          </Link>
          <input
            type="text"
            placeholder="Enter Search Keyword"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-52"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("id")}>National ID</th>
              <th className="py-2 px-4 border">Photo</th>
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("name")}>Full Names</th>
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("email")}>Email</th>
              <th className="py-2 px-4 border">Mobile No</th>
              <th className="py-2 px-4 border">Profession</th>
              <th className="py-2 px-4 border">Ward</th>
              <th className="py-2 px-4 border">Village</th>
              <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort("createdAt")}>Create Date</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{emp.id}</td>
                <td className="py-2 px-4 border">
                  <img
                    src={`${process.env.REACT_APP_BASE_URL}/${emp.image.replace("\\", "/")}`}
                    alt={emp.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="py-2 px-4 border">{emp.name}</td>
                <td className="py-2 px-4 border text-blue-600 underline">
                  {emp.email}
                </td>
                <td className="py-2 px-4 border">{emp.mobile}</td>
                <td className="py-2 px-4 border">{emp.designation}</td>
                <td className="py-2 px-4 border">{emp.gender}</td>
                <td className="py-2 px-4 border">{emp.course}</td>
                <td className="py-2 px-4 border">
                  {new Date(emp.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="py-2 px-4 border space-x-2">
                  <Link
                    to={`/update-employee/${emp._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(emp._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}