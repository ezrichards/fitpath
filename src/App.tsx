import { MantineProvider } from "@mantine/core";
import Header from "./components/header/Header";
import Leaderboard from "./components/leaderboard/Leaderboard";
import ExerciseNode from "./components/path/ExerciseNode";
import PathHeader from "./components/path/PathHeader";
import "@mantine/core/styles.css";
import "./App.css";

export default function App() {
  const currentPath = "Abs";
  const exercises = [
    {
      id: 1,
      name: "Bicycles",
      completed: true,
      description: "Exhale and lift the weights out to the sides until your arms are parallel to the ground. Keep a slight bend in your elbows throughout the movement.",
      recommendations: "Start with 10lb dumbbells. Do 12x reps or until failure. 3 sets per workout."
    },
    {
      id: 2,
      name: "Flutter Kicks",
      completed: false,
      description: "An exercise",
      recommendations: "Lift"
    },
    {
      id: 3,
      name: "Plank",
      completed: false,
      description: "An exercise",
      recommendations: "Lift"
    },
    {
      id: 4,
      name: "Russian Twists",
      completed: false,
      description: "An exercise",
      recommendations: "Lift"
    },
  ];

  return (
    <MantineProvider>
      <div className="app">
        <Header />
        <main>
          <PathHeader name={currentPath} />
          {exercises.map((exercise, index) => (
            <ExerciseNode exercise={exercise} index={index} />
          ))}
        </main>
        <Leaderboard />
      </div>
    </MantineProvider>
  );
}
