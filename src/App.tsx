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
      description: "An exercise",
    },
    {
      id: 2,
      name: "Flutter Kicks",
      completed: false,
    },
    {
      id: 3,
      name: "Plank",
      completed: false,
    },
    {
      id: 4,
      name: "Russian Twists",
      completed: false,
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
