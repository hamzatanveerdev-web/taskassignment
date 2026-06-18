import { useEffect, useState, useRef, useCallback } from "react";
import { attendanceAPI, getUserId } from "../services/api";
import { useAuth } from "../context/hooks";
import toast from "react-hot-toast";
import TimerHeader from "./TimerHeader"; // Adjust the import path as needed

const AttendanceCard = () => {
  const { user } = useAuth();

  const [status, setStatus] = useState("check_in"); // "check_in" or "check_out"
  
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);
  const [displaySeconds, setDisplaySeconds] = useState(0);

  const userId = user?._id || getUserId();
  const timerIntervalRef = useRef(null);
  const lastUpdateTimeRef = useRef(Date.now());

  // Format seconds to HH:MM:SS
  const formatTime = useCallback((totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, []);

  // Load timer status from backend
  useEffect(() => {
    const fetchTimerStatus = async () => {
      if (!userId) return;

      try {
        const res = await attendanceAPI.getTimerStatus();
        if (res.data.success) {
          setStatus(res.data.status);
          setIsTimerRunning(res.data.isRunning);
          setAccumulatedSeconds(res.data.accumulatedSeconds || 0);
          setDisplaySeconds(res.data.accumulatedSeconds || 0);
          
          if (res.data.isRunning) {
            lastUpdateTimeRef.current = Date.now();
          }
        }
      } catch (error) {
        console.error("Failed to fetch timer status:", error);
        setStatus("check_in");
      }
    };




    fetchTimerStatus();
  }, [userId]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - lastUpdateTimeRef.current) / 1000);
        setDisplaySeconds(prev => prev + elapsedSeconds);
        lastUpdateTimeRef.current = now;

        // Sync with localStorage for persistence
        localStorage.setItem('timerData', JSON.stringify({
          displaySeconds: displaySeconds + elapsedSeconds,
          lastUpdateTime: now,
          isTimerRunning: true,
          accumulatedSeconds: accumulatedSeconds
        }));
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      localStorage.removeItem('timerData');
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, displaySeconds, accumulatedSeconds]);

  // Restore timer from localStorage on page load
  useEffect(() => {
    const savedTimerData = localStorage.getItem('timerData');
    if (savedTimerData) {
      try {
        const data = JSON.parse(savedTimerData);
        if (data.isTimerRunning) {
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - data.lastUpdateTime) / 1000);
          setDisplaySeconds(data.displaySeconds + elapsedSeconds);
          setAccumulatedSeconds(data.accumulatedSeconds);
          lastUpdateTimeRef.current = now;
          
          // Verify with backend that timer is actually running
          attendanceAPI.getTimerStatus().then(res => {
            if (res.data.success && !res.data.isRunning) {
              // Backend shows timer is not running, reset
              setIsTimerRunning(false);
              setDisplaySeconds(res.data.accumulatedSeconds || 0);
              localStorage.removeItem('timerData');
            }
          }).catch(() => {
            // If error, assume timer is not running
            setIsTimerRunning(false);
            localStorage.removeItem('timerData');
          });
        }
      } catch (error) {
        console.error('Failed to parse saved timer data:', error);
        localStorage.removeItem('timerData');
      }
    }
  }, []);

  const handleCheckIn = async () => {
    if (!userId) {
      toast.error("User not found");
      return;
    }


    try {
      const res = await attendanceAPI.checkIn();
      if (res.data.success) {
        toast.success("Checked in successfully");
        setStatus("check_out");
        setIsTimerRunning(true);
        setAccumulatedSeconds(res.data.accumulatedSeconds || 0);
        setDisplaySeconds(res.data.accumulatedSeconds || 0);
        lastUpdateTimeRef.current = Date.now();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to check in");
      // Refresh status on error
      attendanceAPI.getTimerStatus().then(res => {
        if (res.data.success) {
          setStatus(res.data.status);
          setIsTimerRunning(res.data.isRunning);
        }
      });
    } finally {
 
    }
  };

  const handleCheckOut = async () => {
    if (!userId) {
      toast.error("User not found");
      return;
    }



    try {
      const res = await attendanceAPI.checkOut();
      if (res.data.success) {
        toast.success(`Checked out successfully. Worked: ${formatTime(res.data.accumulatedSeconds)}`);
        setStatus("check_in");
        setIsTimerRunning(false);
        setAccumulatedSeconds(res.data.accumulatedSeconds || 0);
        setDisplaySeconds(res.data.accumulatedSeconds || 0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to check out");
      // Refresh status on error
      attendanceAPI.getTimerStatus().then(res => {
        if (res.data.success) {
          setStatus(res.data.status);
          setIsTimerRunning(res.data.isRunning);
        }
      });
    } finally {

    }
  };

  const isCheckedIn = status === "check_out";
  const timerDisplay = formatTime(displaySeconds);

  return (
    <TimerHeader
      isCheckedIn={isCheckedIn}
      timerDisplay={timerDisplay}
      onCheckIn={handleCheckIn}
      onCheckOut={handleCheckOut}
      isTimerRunning={isTimerRunning}
      totalTimeToday={accumulatedSeconds}
    />
  );
};

export default AttendanceCard;