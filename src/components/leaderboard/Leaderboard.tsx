import { useEffect, useState } from "react";
import "./Leaderboard.css";
import { supabase } from "../../supabase";
import LeaderboardEntry from "../../types/leaderboard.types";

export default function Leaderboard() {
  const [name, setName] = useState<string | null>(null);
  const [exercise, setExercise] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  function convertToAmPm(timeString: string) { // gpt wrote this lol
    const time = new Date(`1970-01-01T${timeString}Z`);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const amPm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}${amPm}`;
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
