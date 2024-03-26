import { useEffect, useState } from "react";
import "./Leaderboard.css";
import { supabase } from "../../supabase";
import LeaderboardEntry from "../../types/leaderboard.types";

export default function Leaderboard() {
  const [name, setName] = useState<string | null>(null);
  const [exercise, setExercise] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  function convertToAmPm(timeString: string) {
    // gpt wrote this :)
    // Split the time string and extract hours, minutes, and seconds
    const [hoursStr, minutesStr, secondsStr] = timeString.split(":");
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    const seconds = parseInt(secondsStr);

    // Create a Date object with the given time in UTC
    const timeUTC = new Date(Date.UTC(0, 0, 0, hours, minutes, seconds));

    // Get the UTC offset in milliseconds for the current date
    const utcOffset = timeUTC.getTimezoneOffset() * 60000;

    // Denver is UTC-7 (or UTC-6 during daylight saving time)
    const denverOffset = -7 * 60 * 60 * 1000; // Standard offset for Denver
    const isDST = new Date().getTimezoneOffset() < timeUTC.getTimezoneOffset();
    const denverTime = new Date(
      timeUTC.getTime() +
        utcOffset +
        (isDST ? 1 : 0) * 60 * 60 * 1000 +
        denverOffset,
    );

    // Format the time to AM/PM format
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return denverTime.toLocaleString("en-US", options);
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select()
        .returns<LeaderboardEntry[]>();

      if (error) {
        console.log("ERROR WHILE QUERYING BACKEND");
      }

      if (data) {
        setName(data[0].name);
        setExercise(data[0].exercise);
        setTime(data[0].time);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="leaderboard">
      <div className="leaderboard-text">
        <span id="completion">
          <strong>{name}</strong> completed <strong>{exercise}</strong>
        </span>
        <span id="timestamp">
          <strong>{time ? convertToAmPm(time) : "00:00am"}</strong>
        </span>
      </div>
    </div>
  );
}
