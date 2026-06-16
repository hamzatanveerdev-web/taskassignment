import { useEffect, useState } from "react";
import { attendanceAPI, getUserId } from "../services/api";
import { useAuth } from "../context/hooks";
import toast from "react-hot-toast";

const AttendanceCard = () => {
  const { user } = useAuth();

  const [status, setStatus] = useState(null); // IMPORTANT FIX
  const [loading, setLoading] = useState(false);

  const userId = user?._id || getUserId();

  // ✅ Load current status from backend
  useEffect(() => {
    const fetchStatus = async () => {
      if (!userId) return;

      try {
        const res = await attendanceAPI.getStatus(userId);
        setStatus(res.data.status); // "check_in" or "check_out"
      } catch (error) {
        console.error(error);
        setStatus("check_in"); // fallback
      }
    };

    fetchStatus();
  }, [userId]);

  const handleClick = async () => {
    if (!userId) {
      toast.error("User not found");
      return;
    }

    setLoading(true);

    try {
      if (status === "check_in") {
        await attendanceAPI.checkIn({ userId });
        toast.success("Checked in successfully");
        setStatus("check_out"); // switch button
      } else {
        await attendanceAPI.checkOut({ userId });
        toast.success("Checked out successfully");
        setStatus("check_in"); // switch button
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const isCheckIn = status === "check_in";

  return (
    <button
      onClick={handleClick}
      disabled={loading || !status}
      className={`
        relative overflow-hidden px-5 py-2 rounded-full text-sm font-semibold text-white
        transition-all duration-300 shadow-md
        ${isCheckIn ? "bg-green-600" : "bg-red-600"}
        ${loading ? "scale-95 opacity-80" : "hover:scale-105"}
      `}
    >
      {loading && (
        <span className="absolute inset-0 bg-white/20 animate-ping rounded-full" />
      )}

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