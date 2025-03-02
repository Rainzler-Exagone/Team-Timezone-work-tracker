import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const useTime = (timezones: string[]) => {
  const [currentTime, setCurrentTimes] = useState(
    timezones.map((tz) => ({ timezone: tz, time: dayjs().tz(tz).format("HH:mm:ss") })) );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimes(
        timezones.map((tz) => ({ timezone: tz, time: dayjs().tz(tz).format("HH:mm:ss") }))
      );
    }, 1000); // Updates every second

    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

export default useTime;
