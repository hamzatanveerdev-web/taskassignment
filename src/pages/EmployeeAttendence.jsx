import React, { useState } from "react";

const attendanceData = [
  {
    id: 1,
    name: "Ali Khan",
    employeeId: "EMP001",
    checkIn: "09:05 AM",
    checkOut: "06:10 PM",
    date: "2026-06-16",
    status: "Present",
  },
  {
    id: 2,
    name: "Sara Ahmed",
    employeeId: "EMP002",
    checkIn: "09:45 AM",
    checkOut: "06:00 PM",
    date: "2026-06-16",
    status: "Late",
  },
  {
    id: 3,
    name: "Usman Tariq",
    employeeId: "EMP003",
    checkIn: "-",
    checkOut: "-",
    date: "2026-06-16",
    status: "Absent",
  },
];

const statusStyle = (status) => {
  switch (status) {
    case "Present":
      return "bg-green-100 text-green-700";
    case "Late":
      return "bg-yellow-100 text-yellow-700";
    case "Absent":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function EmployeeAttendence() {
  const [search, setSearch] = useState("");

  const filteredData = attendanceData.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Employee Attendance Dashboard
        </h1>

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-3 md:mt-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E1] dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#3BC0E1] text-white">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Employee ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Check In</th>
              <th className="px-6 py-3">Check Out</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((emp) => (
              <tr
                key={emp.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {emp.name}
                </td>
                <td className="px-6 py-4">{emp.employeeId}</td>
                <td className="px-6 py-4">{emp.date}</td>
                <td className="px-6 py-4">{emp.checkIn}</td>
                <td className="px-6 py-4">{emp.checkOut}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                      emp.status
                    )}`}
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}