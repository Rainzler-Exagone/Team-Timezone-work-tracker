import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const useTime = (timezone: string) => {
  const [currentTime, setCurrentTime] = useState(dayjs().tz(timezone).format("HH:mm:ss"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().tz(timezone).format("HH:mm:ss"));
    }, 1000); // Updates every second

    return () => clearInterval(interval);
  }, [timezone]);

  return currentTime;
};

export default useTime;
