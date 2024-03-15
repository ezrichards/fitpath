import "./Leaderboard.css";

export default function Leaderboard() {
  return (
    <div className="leaderboard">
      <div className="leaderboard-text">
        <span id="completion">NAME completed EXERCISE</span>
        <span id="timestamp">00:00am</span>
      </div>
    </div>
  );
}

// TODO query supabase here
// state name, exercise, time -- or just state LeaderboardExercise type
