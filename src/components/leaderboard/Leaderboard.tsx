import { useEffect, useState } from "react";
import "./Leaderboard.css";
import { supabase } from "../../supabase";
import LeaderboardEntry from "../../types/leaderboard.types";

export default function Leaderboard() {
  const [name, setName] = useState<string | null>(null);
  const [exercise, setExercise] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

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
          <strong>{time}</strong>
        </span>
      </div>
    </div>
  );
}
