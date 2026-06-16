import { useState } from "react";
import { attendanceAPI, getUserId } from "../services/api";
import { useAuth } from "../context/hooks";
import toast from "react-hot-toast";

const AttendanceCard = () => {
  const { user } = useAuth();

  const [status, setStatus] = useState("check_in"); 
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const userId = user?._id || getUserId();

    if (!userId) {
      toast.error("User not found");
      return;
    }

    setLoading(true);

    try {
      if (status === "check_in") {
        await attendanceAPI.checkIn({ userId }); // remove if backend uses JWT
        toast.success("Checked in successfully");
        setStatus("check_out");
      } else {
        await attendanceAPI.checkOut({ userId }); // remove if backend uses JWT
        toast.success("Checked out successfully");
        setStatus("check_in");
      }
    } catch (error) {
      console.error("Attendance error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to update attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  const isCheckIn = status === "check_in";

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        relative overflow-hidden px-5 py-2 rounded-full text-sm font-semibold text-white
        transition-all duration-300 shadow-md
        ${isCheckIn ? "bg-green-600" : "bg-red-600"}
        ${loading ? "scale-95 opacity-80" : "hover:scale-105"}
      `}
    >
      {/* Loading animation */}
      {loading && (
        <span className="absolute inset-0 bg-white/20 animate-ping rounded-full" />
      )}

      {/* Button text */}
      <span className="relative z-10">
        {loading
          ? "Processing..."
          : isCheckIn
          ? "Check In"
          : "Check Out"}
      </span>
    </button>
  );
};

export default AttendanceCard;