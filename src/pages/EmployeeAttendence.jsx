import React, { useState, useEffect, useCallback } from "react";
import { attendanceAPI, employeeAPI } from "../services/api";
import { useAuth } from "../context/hooks";
import toast from "react-hot-toast";
import { format } from "date-fns";

// Status style function
const statusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "present":
      return "bg-green-100 text-green-700";
    case "late":
      return "bg-yellow-100 text-yellow-700";
    case "absent":
      return "bg-red-100 text-red-700";
    case "half-day":
      return "bg-orange-100 text-orange-700";
    case "on-leave":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};



// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return dateString;
  }
};

export default function EmployeeAttendance() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    onLeave: 0,
  });

  // 🔥 Fetch employees for filter
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeAPI.getAll(1, 100); // Get all employees
      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, []);

  // 🔥 Fetch attendance from API
  const fetchAttendance = useCallback(async (filters = {}) => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const response = await attendanceAPI.getAllAttendance();

      if (response.data.success) {
        console.log(response.data.attendance);
        setAttendanceData(response.data.attendance);
        setFilteredData(response.data.attendance);
        calculateStats(response.data.attendance);
      } else {
        toast.error(response.data.message || 'Failed to load attendance');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Calculate stats
  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      present: 0,
      late: 0,
      absent: 0,
      onLeave: 0,
    };

    data.forEach(emp => {
      const status = emp.status?.toLowerCase() || '';
      if (status === 'present') stats.present++;
      else if (status === 'late') stats.late++;
      else if (status === 'absent') stats.absent++;
      else if (status === 'on-leave' || status === 'on leave') stats.onLeave++;
    });

    setStats(stats);
  };

  // 🔥 Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...attendanceData];

    // Employee filter
    if (selectedEmployee) {
      filtered = filtered.filter(emp =>
        emp.employeeId_display === selectedEmployee ||
        emp.employeeName?.toLowerCase().includes(selectedEmployee.toLowerCase())
      );
    }

    // Search filter
    if (search) {
      filtered = filtered.filter(emp =>
        emp.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeEmail?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(emp => {
        const empDate = new Date(emp.date).toDateString();
        const filterDate = new Date(selectedDate).toDateString();
        return empDate === filterDate;
      });
    }

    // Month filter
    if (selectedMonth) {
      filtered = filtered.filter(emp => {
        const empMonth = new Date(emp.date).getMonth() + 1;
        return empMonth === parseInt(selectedMonth);
      });
    }

    // Year filter
    if (selectedYear) {
      filtered = filtered.filter(emp => {
        const empYear = new Date(emp.date).getFullYear();
        return empYear === parseInt(selectedYear);
      });
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(emp =>
        emp.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setFilteredData(filtered);
    calculateStats(filtered);
    setCurrentPage(1);
  }, [attendanceData, search, selectedDate, selectedStatus, selectedMonth, selectedYear, selectedEmployee]);

  // Load data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [fetchAttendance, fetchEmployees]);

  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 🔥 Reset filters
  const resetFilters = () => {
    setSearch('');
    setSelectedEmployee('');
    setSelectedDate('');
    setSelectedStatus('all');
    setSelectedMonth('');
    setSelectedYear('');
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Attendance Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(), "EEEE, MMMM dd, yyyy")}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchAttendance()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} color="blue" />
        <StatCard label="Present" value={stats.present} color="green" />
        <StatCard label="Late" value={stats.late} color="yellow" />
        <StatCard label="Absent" value={stats.absent} color="red" />
        <StatCard label="On Leave" value={stats.onLeave} color="purple" />
      </div>

      {/* 🔍 Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E1] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Employee Filter */}
          <div>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E1] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E1] dark:bg-gray-700 dark:text-white dark:border-gray-600"
              title="Filter by specific date"
            />
          </div>

          {/* Month Filter */}
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E1] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E1] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">All Years</option>
              {[2024, 2025, 2026, 2027].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC0E1] dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="on-leave">On Leave</option>
              <option value="half-day">Half Day</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
              title="Reset all filters"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Active filters display */}
        {(search || selectedEmployee || selectedDate || selectedStatus !== 'all' || selectedMonth || selectedYear) && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
            <span className="text-xs text-gray-500">Active Filters:</span>
            {search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                Search: {search}
              </span>
            )}
            {selectedEmployee && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                Employee: {employees.find(e => e._id === selectedEmployee)?.fullName || selectedEmployee}
              </span>
            )}
            {selectedDate && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                Date: {formatDate(selectedDate)}
              </span>
            )}
            {selectedMonth && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                Month: {new Date(2024, parseInt(selectedMonth) - 1, 1).toLocaleString('default', { month: 'long' })}
              </span>
            )}
            {selectedYear && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                Year: {selectedYear}
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                Status: {selectedStatus}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 📋 Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3BC0E1]"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No attendance records found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#3BC0E1] text-white">
                  <tr>
                    <th className="px-4 md:px-6 py-3">#</th>
                    <th className="px-4 md:px-6 py-3">Employee</th>

                    <th className="px-4 md:px-6 py-3">Email</th>
                    <th className="px-4 md:px-6 py-3">Date</th>
                    <th className="px-4 md:px-6 py-3">Check In</th>
                    <th className="px-4 md:px-6 py-3">Check Out</th>
                    <th className="px-4 md:px-6 py-3">Duration</th>
                    <th className="px-4 md:px-6 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((emp, index) => {
                    // Calculate duration
                    const duration = emp.checkIn && emp.checkOut
                      ? (new Date(emp.checkOut) - new Date(emp.checkIn)) / (1000 * 60 * 60)
                      : emp.totalHours || 0;

                    return (
                      <tr
                        key={emp._id || emp.id || index}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 md:px-6 py-3 text-gray-500">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 md:px-6 py-3 font-medium text-gray-800">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#3BC0E1] bg-opacity-20 text-[#3BC0E1] flex items-center justify-center text-sm font-bold">
                              {emp.employeeRef?.fullName?.charAt(0)}
                            </div>
                            <span>{emp.employeeRef?.fullName}</span>
                          </div>
                        </td>

                        <td className="px-4 md:px-6 py-3 text-gray-600 text-sm">
                          <span className="block max-w-[180px] truncate" title={emp.employeeRef?.email}>
                            {emp.employeeRef?.email}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3">{formatDate(emp.date)}</td>
                        <td className="px-4 md:px-6 py-3 font-mono text-sm">{emp.checkIn ? new Date(emp.checkIn).toLocaleTimeString('en-PK', {hour: '2-digit',minute: '2-digit',hour12: true,timeZone: 'Asia/Karachi'}) : '-'}</td>
                        <td className="px-4 md:px-6 py-3 font-mono text-sm">{emp.checkOut ? new Date(emp.checkOut).toLocaleTimeString('en-PK', {hour: '2-digit',minute: '2-digit',hour12: true,timeZone: 'Asia/Karachi'}) : '-'}</td>
                        <td className="px-4 md:px-6 py-3 text-sm">
                          {duration > 0 ? `${Math.round(duration * 60)} min` : '-'}
                        </td>
                        <td className="px-4 md:px-6 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                              emp.status
                            )}`}
                          >
                            {emp.status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 📄 Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 border-t">
              <div className="text-sm text-gray-500 mb-2 md:mb-0">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1
                      ? 'bg-[#3BC0E1] text-white'
                      : 'border hover:bg-gray-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 📊 Stat Card Component
const StatCard = ({ label, value, color, icon }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className={`${colors[color]} p-4 rounded-xl shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium opacity-70">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
};
