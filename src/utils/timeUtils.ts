// src/utils/timeUtils.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(timezone);



export const sortTeamByTimezone = (teamMembers: { name: string; timezone: string }[]) => {
  return [...teamMembers].sort((a, b) => {
    return dayjs().tz(a.timezone).utcOffset() - dayjs().tz(b.timezone).utcOffset();
  });
};



/**
 * Get local time range corresponding to 9-5 in a US timezone
 * @param userTimezone - The user's local timezone (e.g., "Europe/London", "Asia/Tokyo")
 * @param usTimezone - The US timezone for 9-5 schedule (e.g., "America/New_York")
 * @returns Local start and end time for the user
 */





export const getLocalWorkHours  = (startTime:string,endTime:string,targetTimeZone:string) => {
  const originalTimeZone = "America/New_York";
  const startTimeString = startTime;
  const endTimeString = endTime;
  const dummyDate = "2000-01-01"; // Dummy date (any date will work)

  // Convert start time
  const startDateTimeString = `${dummyDate} ${startTimeString}`;
  const startTimeInOriginalTZ = dayjs.tz(
    startDateTimeString,
    originalTimeZone
  );
  const startTimeInTargetTZ = startTimeInOriginalTZ.tz(targetTimeZone);
  const formattedStartTime = startTimeInTargetTZ.format("HH:mm");

  // Convert end time
  const endDateTimeString = `${dummyDate} ${endTimeString}`;
  const endTimeInOriginalTZ = dayjs.tz(endDateTimeString, originalTimeZone);
  const endTimeInTargetTZ = endTimeInOriginalTZ.tz(targetTimeZone);
  const formattedEndTime = endTimeInTargetTZ.format("HH:mm");

  return {
    startTime: formattedStartTime,
    endTime: formattedEndTime,
  };
}


export const getWorkStatus = (currentTime: string, startTime: string, endTime: string): "Working" | "Before Shift" | "After Shift" =>{
  const current = dayjs(`1970-01-01T${currentTime}`);
  const start = dayjs(`1970-01-01T${startTime}`);
  const end = dayjs(`1970-01-01T${endTime}`);

  if (end.isAfter(start)) {
    // Normal shift (same-day range)
    if (current.isBetween(start, end, null, "[]")) {
      return "Working";
    }
    return current.isBefore(start) ? "Before Shift" : "After Shift";
  } else {
    // Overnight shift (crosses midnight)
    if (current.isAfter(start) || current.isBefore(end)) {
      return "Working";
    }
    return current.isBefore(start) ? "Before Shift" : "After Shift";
  }
}


console.log(getLocalWorkHours("09:00", "17:00", "Asia/Tokyo"));













export const  displayRealTimeTime = (targetTimeZone:any) => {
  let intervalId: NodeJS.Timeout | undefined;

  const updateTime = () => {
    const now = dayjs().tz(targetTimeZone); // Get current time in target timezone
    const formattedTime = now.format('HH:mm:ss'); // Format as HH:mm:ss (or hh:mm:ss A for AM/PM)

    console.log(formattedTime);
    
  };

  if (intervalId) {
    clearInterval(intervalId);
  }

  // Initial display
  updateTime();

  // Update every second
  intervalId = setInterval(updateTime, 1000);
}

// const now = dayjs().tz("America/New_York"); // Get current time in target timezone
//     const formattedTime = now.format('HH:mm:ss');
//     console.log(formattedTime);
    
